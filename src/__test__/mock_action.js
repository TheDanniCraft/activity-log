
inputs = {
    GITHUB_USERNAME: 'test-user',    // GitHub username 
    GITHUB_TOKEN: "test token",      // GitHub token
    EVENT_LIMIT: 10,                 // Number of events to fetch
    OUTPUT_STYLE: "MARKDOWN",
    IGNORE_EVENTS:'[]',
    HIDE_DETAILS_ON_PRIVATE_REPOS: 'false',
    README_PATH: "README.md",
    COMMIT_MESSAGE: "Update README.md with latest activity"
};

// Load inputs from GitHub Actions
module.exports = {
    inputs
};