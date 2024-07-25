const path = require('path');
const core = require('@actions/core');

// Function to process ignore events
function processIgnoreEvents(value) {
    return value
        .replace(/^\[|\]$/g, '') // Remove leading and trailing brackets
        .split(',')
        .map(event => event.trim())
        .filter(Boolean); // Remove any empty values
}

// Load inputs from GitHub Actions
module.exports = {
    username: core.getInput('GITHUB_USERNAME', { required: true }),
    token: core.getInput('GITHUB_TOKEN', { required: true }),
    eventLimit: (() => {
        const limit = parseInt(core.getInput('EVENT_LIMIT'), 10);
        if (limit > 100) {
            throw new Error('❌ EVENT_LIMIT cannot be greater than 100.');
        }
        return limit;
    })(),
    ignoreEvents: processIgnoreEvents(core.getInput('IGNORE_EVENTS')),
    readmePath: core.getInput('README_PATH'),
    commitMessage: core.getInput('COMMIT_MESSAGE')
};
