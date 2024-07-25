const path = require('path');

// Function to get inputs from GitHub Actions
function getInput(name, options = {}) {
    const { required = false, defaultValue = '' } = options;
    const value = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || defaultValue;
    if (required && !value) {
        throw new Error(`❌ Input required and not supplied: ${name}`);
    }
    return value.trim();
}

// Function to process ignore events
function processIgnoreEvents(value) {
    return value
        .replace(/^\[|\]$/g, '') // Remove leading and trailing brackets
        .split(',')
        .map(event => event.trim())
        .filter(Boolean); // Remove any empty values
}

module.exports = {
    username: getInput('GITHUB_USERNAME', { required: true }),
    token: getInput('GITHUB_TOKEN', { required: true }),
    eventLimit: (() => {
        const limit = parseInt(getInput('EVENT_LIMIT', { required: true }));
        if (limit > 100) {
            throw new Error('❌ EVENT_LIMIT cannot be greater than 100.');
        }
        return limit;
    })(),
    ignoreEvents: processIgnoreEvents(getInput('IGNORE_EVENTS', { required: false, defaultValue: '[]' })),
    readmePath: getInput('README_PATH', { required: false, defaultValue: path.resolve(__dirname, '../README.md') })
};
