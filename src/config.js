const core = require('@actions/core');

function processIgnoreEvents(value) {
    return value
        .replace(/^\[|\]$/g, '') // Remove leading and trailing brackets
        .split(',')
        .map(event => event.trim())
        .filter(Boolean); // Remove any empty values
}

function processEventLimit(value) {
    const limit = parseInt(value, 10);
    if (isNaN(limit)) {
        core.setFailed('❌ EVENT_LIMIT is not a number');
        process.exit(1);
    }
    if (limit < 1) {
        core.setFailed('❌ EVENT_LIMIT cannot be smaller than 1');
        process.exit(1);
    }
    if (limit > 100) {
        core.setFailed('❌ EVENT_LIMIT cannot be greater than 100.');
        process.exit(1);
    }
    return limit;
}

function processStyle(value) {
    const style = value.toUpperCase();

    if (style !== "MARKDOWN" && style !== "HTML") {
        core.setFailed('❌ OUTPUT_STYLE is not MARKDOWN or HTML');
        process.exit(1);
    }

    return value;
}

// Load inputs from GitHub Actions
module.exports = {
    username: core.getInput('GITHUB_USERNAME', { required: true }),
    token: core.getInput('GITHUB_TOKEN', { required: true }),
    eventLimit: processEventLimit(core.getInput('EVENT_LIMIT')),
    style: processStyle(core.getInput('OUTPUT_STYLE')),
    ignoreEvents: processIgnoreEvents(core.getInput('IGNORE_EVENTS')),
    readmePath: core.getInput('README_PATH'),
    commitMessage: core.getInput('COMMIT_MESSAGE')
};
