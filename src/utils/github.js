const github = require('@actions/github');
const core = require('@actions/core');
const eventDescriptions = require('./eventDescriptions');
const { username, token, eventLimit, ignoreEvents } = require('../config');

// Create an authenticated Octokit client
const octokit = github.getOctokit(token);

// Function to fetch repository details and starred repositories
async function fetchRepoDetails() {
    try {
        const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser();
        const { data: starredRepos } = await octokit.rest.activity.listReposStarredByAuthenticatedUser();

        // Create a map of repo name to its visibility status
        const repoVisibility = repos.reduce((map, repo) => {
            map[repo.name] = !repo.private; // Store visibility status as true for public
            return map;
        }, {});

        // Create a set of starred repo names
        const starredRepoNames = new Set(starredRepos.map(repo => `${repo.owner.login}/${repo.name}`));

        return { repoVisibility, starredRepoNames };
    } catch (error) {
        core.setFailed(`❌ Error fetching repository details: ${error.message}`);
        return;
    }
}

// Function to check if the event was likely triggered by GitHub Actions or bots
function isTriggeredByGitHubActions(event) {
    // Regex patterns to match common GitHub Actions or bot commit messages
    const botPatterns = /(\[bot\]|GitHub Actions|github-actions)/i;

    // Check if the commit author name matches any of the bot patterns
    const isCommitEvent = event.type === 'PushEvent' && event.payload && event.payload.commits;
    if (isCommitEvent) {
        return event.payload.commits.some(commit =>
            botPatterns.test(commit.author.name) // Test commit message against regex patterns
        );
    }
    return false;
}

// Function to fetch all events with pagination and apply filtering
async function fetchAllEvents() {
    let allEvents = [];
    let page = 1;

    while (allEvents.length < eventLimit) {
        try {
            const { data: events } = await octokit.rest.activity.listPublicEventsForUser({
                username,
                per_page: 30,
                page
            });

            // Check for API rate limit or pagination issues
            if (events.length === 0) {
                core.warning('⚠️ No more events available.');
                break; // No more events to fetch
            }

            allEvents = allEvents.concat(events);
            page++;

            // Exit loop if we have enough events
            if (allEvents.length >= eventLimit) {
                break;
            }
        } catch (error) {
            core.setFailed(`❌ Error fetching events: ${error.message}`);
            break;
        }
    }

    return allEvents;
}

// Function to fetch and filter events
async function fetchAndFilterEvents() {
    let allEvents = await fetchAllEvents();
    const { repoVisibility, starredRepoNames } = await fetchRepoDetails();

    let filteredEvents = [];

    while (filteredEvents.length < eventLimit) {
        filteredEvents = allEvents
            .filter(event => !ignoreEvents.includes(event.type))
            .filter(event => !isTriggeredByGitHubActions(event))
            .map(event => {
                if (event.type === 'WatchEvent') {
                    const isStarred = starredRepoNames.has(event.repo.name);
                    // Change the event type to 'StarEvent' if the repo is starred
                    return { ...event, type: isStarred ? 'StarEvent' : 'WatchEvent' };
                }
                return event;
            })
            .slice(0, eventLimit);

        if (filteredEvents.length < eventLimit) {
            const additionalEvents = await fetchAllEvents();
            allEvents = additionalEvents.concat(allEvents);
        } else {
            break;
        }
    }

    filteredEvents = filteredEvents.slice(0, eventLimit);

    const fetchedEventCount = filteredEvents.length;
    const totalFetchedEvents = allEvents.length;

    if (fetchedEventCount < eventLimit) {
        core.warning(`⚠️ Only ${fetchedEventCount} events met the criteria. ${totalFetchedEvents - fetchedEventCount} events were skipped due to filters.`);
    }

    // Generate ordered list of events with descriptions
    const listItems = filteredEvents.map((event, index) => {
        const type = event.type;
        const repo = event.repo;
        const isPrivate = repoVisibility[repo.name] === undefined ? repo.private : repoVisibility[repo.name];
        const action = event.payload.pull_request
            ? (event.payload.pull_request.merged ? 'merged' : event.payload.action)
            : event.payload.action;

        const pr = event.payload.pull_request || {};
        const payload = event.payload;

        const description = eventDescriptions[type]
            ? (typeof eventDescriptions[type] === 'function'
                ? eventDescriptions[type]({ repo, isPrivate, pr, payload })
                : (eventDescriptions[type][action]
                    ? eventDescriptions[type][action]({ repo, pr, isPrivate, payload })
                    : core.warning(`Unknown action: ${action}`)))
            : core.warning(`Unknown event: ${event}`);

        return `${index + 1}. ${description}`;
    });

    return listItems.join('\n');
}

module.exports = {
    fetchAndFilterEvents,
};