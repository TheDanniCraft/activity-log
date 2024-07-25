const { execSync } = require('child_process');
const eventDescriptions = require('./eventDescriptions');
const { username, token, eventLimit, ignoreEvents } = require('../config');

// GitHub API URLs to fetch user events and repository details
const eventsApiUrl = `https://api.github.com/users/${username}/events`;
const repoApiUrl = `https://api.github.com/user/repos`;

// Function to execute a curl command and return the result
function executeCurl(url) {
    try {
        const result = execSync(`curl -s -H "Authorization: token ${token}" -H "Accept: application/vnd.github.v3+json" ${url}`, { encoding: 'utf-8' });
        return JSON.parse(result);
    } catch (error) {
        console.error('❌ Error executing curl command:', error.message);
        return [];
    }
}

// Function to fetch repository details
function fetchRepoDetails() {
    const repos = executeCurl(repoApiUrl);

    // Create a map of repo name to its visibility status
    return repos.reduce((map, repo) => {
        map[repo.name] = !repo.private; // Store visibility status as true for public
        return map;
    }, {});
}

// Function to fetch all events with pagination and apply filtering
function fetchAllEvents() {
    let allEvents = [];
    let page = 1;

    while (true) {
        const url = `${eventsApiUrl}?page=${page}`;
        const events = executeCurl(url);

        // Check for API rate limit or pagination issues
        if (events.message && events.message === "In order to keep the API fast for everyone, pagination is limited for this resource.") {
            console.warn('⚠️ Warning: Some events may have been skipped due to API pagination limits.');
            break;
        }

        if (events.length === 0) {
            break; // No more events to fetch
        }

        allEvents = allEvents.concat(events);

        // Stop if we've fetched enough events
        if (allEvents.length >= eventLimit) {
            break;
        }

        page++;
    }

    // Filter events to match the eventLimit
    const filteredEvents = allEvents
        .filter(event => !ignoreEvents.includes(event.type)) // Exclude ignored events
        .filter(event => !['CreateEvent', 'DeleteEvent'].includes(event.type)) // Exclude branch-related events
        .slice(0, eventLimit); // Limit to the number specified

    return {
        events: filteredEvents,
        skipped: allEvents.length > eventLimit ? allEvents.length - eventLimit : 0
    };
}

// Function to fetch and filter events
function fetchAndFilterEvents() {
    const { events, skipped } = fetchAllEvents(); // Fetch all events with pagination
    const repoDetails = fetchRepoDetails();

    // Generate ordered list of events with descriptions
    const listItems = [];

    for (const event of events) {
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
