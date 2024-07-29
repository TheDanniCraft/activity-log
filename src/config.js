const core = require('@actions/core');

// Function to process ignore events
function processIgnoreEvents(value) {
    return value
        .replace(/^\[|\]$/g, '') // Remove leading and trailing brackets
        .split(',')
        .map(event => event.trim())
        .filter(Boolean); // Remove any empty values
}

// Function to process event limit
function processEventLimit(value) {
    const limit = parseInt(value, 10);
    if (isNaN(limit)) core.setFailed('❌ EVENT_LIMIT is not a number');
    if (limit < 1) core.setFailed('❌ EVENT_LIMIT can not be smaller than 1');
    if (limit > 100) core.setFailed('❌ EVENT_LIMIT cannot be greater than 100.');
    return limit;
}

// Load inputs from GitHub Actions
module.exports = {
    username: core.getInput('GITHUB_USERNAME', { required: true }),
    token: core.getInput('GITHUB_TOKEN', { required: true }),
    eventLimit: processEventLimit(core.getInput('EVENT_LIMIT')),
    ignoreEvents: processIgnoreEvents(core.getInput('IGNORE_EVENTS')),
    readmePath: core.getInput('README_PATH'),
    commitMessage: core.getInput('COMMIT_MESSAGE')
};
