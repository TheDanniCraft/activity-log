const github = require('@actions/github');
const eventDescriptions = require('./eventDescriptions');
const { username, token, eventLimit, ignoreEvents } = require('../config');

// Create an authenticated Octokit client
const octokit = github.getOctokit(token);

// Function to fetch repository details
async function fetchRepoDetails() {
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser();

    // Create a map of repo name to its visibility status
    return repos.reduce((map, repo) => {
        map[repo.name] = !repo.private; // Store visibility status as true for public
        return map;
    }, {});
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
    let totalFetched = 0;

    while (totalFetched < eventLimit) {
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
        totalFetched = allEvents.length;

        if (events.length < 30) {
            break; // No more pages
        }

        page++;
    }

    return allEvents;
}

// Function to fetch and filter events
async function fetchAndFilterEvents() {
    let allEvents = await fetchAllEvents(); // Fetch all events with pagination
    const repoDetails = await fetchRepoDetails();

    let filteredEvents = [];

    // Apply filtering and refetch if necessary
    while (filteredEvents.length < eventLimit) {
        // Apply filtering
        filteredEvents = allEvents
            .filter(event => !ignoreEvents.includes(event.type)) // Exclude ignored events
            .filter(event => !['CreateEvent', 'DeleteEvent'].includes(event.type)) // Exclude branch-related events
            .filter(event => !isTriggeredByGitHubActions(event)); // Exclude GitHub Actions triggered events

        // Slice to meet event limit if needed
        filteredEvents = filteredEvents.slice(0, eventLimit);

        if (filteredEvents.length < eventLimit) {
            // Fetch more events if we still need more
            const additionalEvents = await fetchAllEvents();
            allEvents = additionalEvents.concat(allEvents); // Add new events to existing
        } else {
            break; // We have enough events
        }
    }

    // Final filtering and limiting
    filteredEvents = filteredEvents.slice(0, eventLimit);

    const fetchedEventCount = filteredEvents.length;
    const totalFetchedEvents = allEvents.length;

    if (fetchedEventCount < eventLimit) {
        core.warning(`⚠️ Only ${fetchedEventCount} events met the criteria. ${totalFetchedEvents - fetchedEventCount} events were skipped due to filters.`);
    }

    // Generate ordered list of events with descriptions
    const listItems = [];

    for (const event of filteredEvents) {
        const type = event.type;
        const repo = event.repo;
        const isPrivate = repo.private;
        const action = event.payload.action || (event.payload.pull_request && event.payload.pull_request.merged) ? (event.payload.action || 'merged') : '';
        const pr = event.payload.pull_request || {};
        const payload = event.payload;

        const description = eventDescriptions[type]
            ? (typeof eventDescriptions[type] === 'function'
                ? eventDescriptions[type]({ repo, isPrivate, pr, payload })
                : (eventDescriptions[type][action]
                    ? eventDescriptions[type][action]({ repo, pr, isPrivate, payload })
                    : 'Unknown action'))
            : 'Unknown event';

        listItems.push(`${listItems.length + 1}. ${description}`);
    }

    return listItems.join('\n');
}

module.exports = {
    fetchAndFilterEvents,
};
