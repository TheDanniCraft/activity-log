import { getOctokit } from '@actions/github';
import { warning } from '@actions/core';
import eventDescriptions from './eventDescriptions.js';
import { username, token, eventLimit, style, ignoreEvents, hideDetailsOnPrivateRepos } from '../config.js';

// Create an authenticated Octokit client
const octokit = getOctokit(token);

// Function to fetch starred repositories with pagination
async function fetchAllStarredRepos() {
    let starredRepos = [];
    let page = 1;

    while (true) {
        try {
            const { data: pageStarredRepos } = await octokit.rest.activity.listReposStarredByAuthenticatedUser({
                per_page: 100,
                page
            });

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
    // Regex patterns to match common GitHub Actions or bot commit messages
    const botPattern = /\[bot\]$|^github-actions$|^dependabot$|^dependabot\[bot\]$/i;

    const sha = event.payload.head;
    const fullName = event.repo.name;

    if (!sha || !fullName) return false;

    const [owner, repo] = fullName.split('/');

    try {
        const { data: commit } = await octokit.rest.repos.getCommit({
            owner,
            repo,
            ref: sha,
        });

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

        return fields.some((v) => botPattern.test(v)) || messageLooksAutomated;
    } catch (error) {
        if (error.status === 404) {
            // Commit was force-pushed or deleted; skip bot-check and keep going
            return false;
        }
        throw error;
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
        const { data: events } = await octokit.rest.activity.listEventsForAuthenticatedUser({
            username,
            per_page: 100,
            page
        });

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

        let description;
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
