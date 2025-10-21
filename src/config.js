const core = require('@actions/core');
const { parse } = require('yaml');

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
    if (limit > 250) {
        core.setFailed('❌ EVENT_LIMIT cannot be greater than 250.');
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

function processBooleanInput(value, inputName) {
    if (value === undefined || value === '') {
        return false;
    }

    const boolValue = value.trim().toLowerCase();

    if (!['true', 'false'].includes(boolValue)) {
        core.setFailed(`❌ ${inputName} must be "true" or "false"`);
        process.exit(1);
    }

    return boolValue === 'true';
}

function processOutputMode(value) {
    const mode = value.toLowerCase();

    if (mode !== 'list' && mode !== 'table') {
        core.setFailed('❌ OUTPUT_MODE must be "list" or "table"');
        process.exit(1);
    }

    return mode;
}

function processEventEmojiMap(value) {
    const map = {
        PushEvent: "📝",
        CreateEvent: "🎉",
        DeleteEvent: "🗑️",
        IssuesEvent: {
            opened: "🆕",
            edited: "🔧",
            closed: "❌",
            reopened: "🔄",
            assigned: "👤",
            unassigned: "👤",
            labeled: "🏷️",
            unlabeled: "🏷️",
        },
        PullRequestEvent: {
            opened: "📥",
            edited: "📝",
            closed: "❌",
            merged: "🔀",
            reopened: "🔄",
            assigned: "👤",
            unassigned: "👤",
            review_requested: "🔍",
            review_request_removed: "🔍",
            labeled: "🏷️",
            unlabeled: "🏷️",
            synchronize: "🔄",
        },
        ReleaseEvent: {
            draft: "✏️",
            published: "🚀",
        },
        ForkEvent: "🍴",
        CommitCommentEvent: "🗣",
        IssueCommentEvent: "🗣",
        PullRequestReviewEvent: "🔎",
        PullRequestReviewCommentEvent: "🗣",
        PullRequestReviewThreadEvent: "🧵",
        RepositoryEvent: "📋",
        WatchEvent: "🔔",
        StarEvent: "⭐",
        PublicEvent: "🌍",
        GollumEvent: "📝",
    };

    if (!value || (typeof value === 'string' && value.trim() === '')) {
        core.notice('ℹ️ No custom emoji mapping provided, using default emojis.');
        return map;
    }

    if (typeof value === 'string') {
        let userMap;
        try {
            userMap = parse(value);
        } catch (error) {
            core.setFailed(`❌ Failed to parse user-provided EVENT_EMOJI_MAP YAML: ${error.message}`);
            process.exit(1);
        }

        Object.keys(userMap).forEach(event => {
            let userValue = userMap[event];
            // If the value is a string, attempt to parse it as YAML to handle nested objects
            if (typeof userValue === 'string') {
                try {
                    userValue = parse(userValue);
                } catch (error) {
                    core.setFailed(`❌ Failed to parse nested YAML structure in EVENT_EMOJI_MAP for "${event}": ${error.message}`);
                    process.exit(1);
                }
            }
            if (typeof map[event] === 'object' && typeof userValue === 'string') {
                core.setFailed(`❌ EVENT_EMOJI_MAP for "${event}" must be an object, not a string`);
                process.exit(1);
            }
            if (typeof map[event] === 'object' && typeof userValue === 'object') {
                Object.assign(map[event], userValue);
            } else {
                map[event] = userValue;
            }
        });
    }

    core.notice(`🔣 Using event emoji map keys: ${JSON.stringify(map)}`);
    return map;
}

// Load inputs from GitHub Actions
module.exports = {
    username: core.getInput('GITHUB_USERNAME', { required: true }),
    token: core.getInput('GITHUB_TOKEN', { required: true }),
    eventLimit: processEventLimit(core.getInput('EVENT_LIMIT')),
    style: processStyle(core.getInput('OUTPUT_STYLE')),
    ignoreEvents: processIgnoreEvents(core.getInput('IGNORE_EVENTS')),
    hideDetailsOnPrivateRepos: processBooleanInput(core.getInput('HIDE_DETAILS_ON_PRIVATE_REPOS'), 'HIDE_DETAILS_ON_PRIVATE_REPOS'),
    readmePath: core.getInput('README_PATH'),
    commitMessage: core.getInput('COMMIT_MESSAGE'),
    eventEmojiMap: processEventEmojiMap(core.getInput('EVENT_EMOJI_MAP')),
    dryRun: processBooleanInput(core.getInput('DRY_RUN'), 'DRY_RUN'),
    outputMode: processOutputMode(core.getInput('OUTPUT_MODE'))
};
