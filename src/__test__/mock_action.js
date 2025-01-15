const core = require('@actions/core');

const inputs = {
    EVENT_LIMIT: '200',
    GITHUB_USERNAME: "jest_test",
    GITHUB_TOKEN: 'ghp_1234567890',
    EVENT_LIMIT:'10',
    OUTPUT_STYLE: "MARKDOWN",
    IGNORE_EVENTS: '[]',
    README_PATH: "README.md",
    COMMIT_MESSAGE: "Update README.md with latest activity"
};

module.exports = {
    inputs
};