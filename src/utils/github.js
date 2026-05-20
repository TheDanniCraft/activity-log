import { warning } from '@actions/core';
import eventDescriptions from './eventDescriptions.js';
import { applyTemplate, extractEventData } from './templateEngine.js';
import { createOctokit } from './octokit.js';
import {
    username,
    token,
    eventLimit,
    style,
    ignoreEvents,
    hideDetailsOnPrivateRepos,
    eventEmojiMap,
    eventTemplate
} from '../config.js';

// Create an authenticated Octokit client
const octokit = createOctokit(token);
const commitBotCheckCache = new Map();

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getHeaderValue(headers, headerName) {
    if (!headers) return undefined;
    const direct = headers[headerName];
    if (direct !== undefined) return direct;
    const lowerName = headerName.toLowerCase();
    for (const [key, value] of Object.entries(headers)) {
        if (key.toLowerCase() === lowerName) return value;
    }
    return undefined;
}

async function withRateLimitRetry(requestFn, label, maxRetries = 4) {
    let attempt = 0;
    let delayMs = 0;

    while (true) {
        if (delayMs > 0) {
            await sleep(delayMs);
        }

        try {
            return await requestFn();
        } catch (error) {
            const status = error?.status;
            const message = String(error?.message || '');
            const headers = error?.response?.headers || {};

            const isSecondaryRateLimit =
                (status === 403 || status === 429) &&
                /secondary rate limit/i.test(message);

            if (!isSecondaryRateLimit || attempt >= maxRetries) {
                throw error;
            }

            const retryAfterHeader = getHeaderValue(headers, 'retry-after');
            const retryAfterSeconds = Number(retryAfterHeader);
            const baseDelayMs = Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
                ? retryAfterSeconds * 1000
                : 60_000;
            const exponentialFactor = Math.min(2 ** attempt, 8);
            delayMs = baseDelayMs * exponentialFactor;
            attempt++;

            warning(`Secondary rate limit hit during ${label}. Retry ${attempt}/${maxRetries} in ${Math.round(delayMs / 1000)}s.`);
        }
    }
}

// Function to fetch starred repositories with pagination
async function fetchAllStarredRepos() {
    let starredRepos = [];
    let page = 1;

    while (true) {
        try {
            const { data: pageStarredRepos } = await withRateLimitRetry(
                () => octokit.rest.activity.listReposStarredByAuthenticatedUser({
                    per_page: 100,
                    page
                }),
                'fetching starred repositories'
            );

            if (pageStarredRepos.length === 0) {
                break;
            }

            starredRepos = starredRepos.concat(pageStarredRepos);
            page++;
        } catch (error) {
            throw new Error(`Error fetching starred repositories: ${error.message}`);
        }
    }

    // Create a set of starred repo names
    const starredRepoNames = new Set(starredRepos.map((repo) => `${repo.owner.login}/${repo.name}`));

    return { starredRepoNames };
}

// Function to check if the event was likely triggered by GitHub Actions or bots
async function isTriggeredByGitHubActions(event) {
    if (event?.type !== 'PushEvent') {
        return false;
    }

    // Regex patterns to match common GitHub Actions or bot commit messages
    const botPattern = /\[bot\]$|^github-actions$|^dependabot$|^dependabot\[bot\]$/i;

    const actorLogin = event?.actor?.login || '';
    if (botPattern.test(actorLogin)) return true;

    const sha = event.payload.head;
    const fullName = event.repo.name;

    if (!sha || !fullName) return false;

    const [owner, repo] = fullName.split('/');
    const cacheKey = `${fullName}#${sha}`;
    if (commitBotCheckCache.has(cacheKey)) {
        return commitBotCheckCache.get(cacheKey);
    }

    try {
        const { data: commit } = await withRateLimitRetry(
            () => octokit.rest.repos.getCommit({
                owner,
                repo,
                ref: sha,
            }),
            `checking commit ${sha.slice(0, 7)} in ${fullName}`
        );

        // Check if the commit author name matches any of the bot patterns
        const fields = [
            commit?.author?.login,
            commit?.committer?.login,
            commit?.commit?.author?.name,
            commit?.commit?.author?.email,
            commit?.commit?.committer?.name,
            commit?.commit?.committer?.email,
        ].filter(Boolean);

        const message = commit?.commit?.message || '';

        const messageLooksAutomated =
            /\bci\b|^chore(\(|:)|^build(\(|:)|dependabot/i.test(message);

        const isAutomated = fields.some((v) => botPattern.test(v)) || messageLooksAutomated;
        commitBotCheckCache.set(cacheKey, isAutomated);
        return isAutomated;
    } catch (error) {
        if (error.status === 404) {
            // Commit was force-pushed or deleted; skip bot-check and keep going
            return false;
        }

        // Never fail the workflow because of commit bot-detection lookups.
        // If this check fails, keep the event instead of aborting the run.
        warning(`Bot-check skipped for ${fullName}@${sha.slice(0, 7)}: ${error.message}`);
        return false;
    }
}

// Helper function to encode URLs
function encodeHTML(str) {
    return str
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

// Function to fetch all events with pagination and apply filtering
async function fetchEvents(page) {
    try {
        const { data: events } = await withRateLimitRetry(
            () => octokit.rest.activity.listEventsForAuthenticatedUser({
                username,
                per_page: 100,
                page
            }),
            `fetching events page ${page}`
        );

        if (events.length === 0) {
            warning('No more events available.');
            return events;
        }

        return events;
    } catch (error) {
        throw new Error(`Error fetching events: ${error.message}`);
    }
}

// Function to fetch and filter events
async function fetchAndFilterEvents() {
    const { starredRepoNames } = await fetchAllStarredRepos();
    let page = 1;
    let allEvents = await fetchEvents(page);

    let filteredEvents = [];

    while (filteredEvents.length < eventLimit) {
        const candidates = allEvents.filter((event) => !ignoreEvents.includes(event.type));

        const keepFlags = await Promise.all(
            candidates.map(async (event) => !(await isTriggeredByGitHubActions(event)))
        );

        filteredEvents = candidates
            .filter((_, i) => keepFlags[i])
            .map((event) => {
                if (event.type === 'WatchEvent') {
                    const isStarred = starredRepoNames.has(event.repo.name);
                    return { ...event, type: isStarred ? 'StarEvent' : 'WatchEvent' };
                }
                return event;
            })
            .slice(0, eventLimit);

        if (filteredEvents.length < eventLimit) {
            page++;
            if (page > 3) {
                warning(`Due to GitHub limitations, only the last ${allEvents.length} events (${filteredEvents.length} after filtering) will be displayed.`);
                break;
            }
            const additionalEvents = await fetchEvents(page);

            if (additionalEvents.length === 0) break;
            allEvents = allEvents.concat(additionalEvents);
        } else {
            break;
        }
    }

    filteredEvents = filteredEvents.slice(0, eventLimit);

    const fetchedEventCount = filteredEvents.length;
    const totalFetchedEvents = allEvents.length;

    if (fetchedEventCount < eventLimit) {
        warning(`Only ${fetchedEventCount} events met the criteria. ${totalFetchedEvents - fetchedEventCount} events were skipped due to filters.`);
    }

    // Generate ordered list of events with descriptions
    const listItems = filteredEvents.map((event, index) => {
        const type = event.type;
        const repo = event.repo;
        const isPrivate = !event.public;
        const action = event.payload.pull_request
            ? (event.payload.pull_request.merged ? 'merged' : event.payload.action)
            : event.payload.action;

        const pr = event.payload.pull_request || {};
        const payload = event.payload;

        let description = null;

        if (eventTemplate) {
            const eventData = extractEventData(event, eventEmojiMap, hideDetailsOnPrivateRepos);
            description = applyTemplate(eventTemplate, eventData);
        }

        if (!description) {
            if (!eventDescriptions[type]) {
                warning(`Unknown event type: ${type}`);
                description = `Unknown event in ${repo.name}`;
            } else if (typeof eventDescriptions[type] === 'function') {
                description = eventDescriptions[type]({ repo, isPrivate, pr, payload, hideDetailsOnPrivateRepos });
            } else if (eventDescriptions[type][action]) {
                description = eventDescriptions[type][action]({ repo, pr, isPrivate, payload, hideDetailsOnPrivateRepos });
            } else {
                warning(`Unknown action "${action}" for event type "${type}"`);
                description = `Unknown ${type} action in ${repo.name}`;
            }
        }

        return style === 'MARKDOWN'
            ? `${index + 1}. ${description}`
            : `<li>${encodeHTML(description)}</li>`;
    });

    return style === 'MARKDOWN'
        ? listItems.join('\n')
        : `<ol>\n${listItems.join('\n')}\n</ol>`;
}

export {
    fetchAndFilterEvents,
};
