import { getInput, notice, setFailed } from '@actions/core';
import { parse } from 'yaml';

function processIgnoreEvents(value) {
    if (!value || value.trim() === '') {
        return [];
    }

    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
            return parsed
                .map((event) => String(event).trim())
                .filter(Boolean);
        }
    } catch {
        // Fallback for non-JSON comma-separated input.
    }

    return value
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((event) => event.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
}

function processEventLimit(value) {
    const limit = parseInt(value, 10);
    if (isNaN(limit)) {
        setFailed('❌ EVENT_LIMIT is not a number');
        process.exit(1);
    }
    if (limit < 1) {
        setFailed('❌ EVENT_LIMIT cannot be smaller than 1');
        process.exit(1);
    }
    if (limit > 250) {
        setFailed('❌ EVENT_LIMIT cannot be greater than 250.');
        process.exit(1);
    }
    return limit;
}

function processStyle(value) {
    const style = value.toUpperCase();

    if (style !== "MARKDOWN" && style !== "HTML") {
        setFailed('❌ OUTPUT_STYLE is not MARKDOWN or HTML');
        process.exit(1);
    }

    return style;
}

function processBooleanInput(value, inputName) {
    if (value === undefined || value === '') {
        return false;
    }

    const boolValue = value.trim().toLowerCase();

    if (!['true', 'false'].includes(boolValue)) {
        setFailed(`❌ ${inputName} must be "true" or "false"`);
        process.exit(1);
    }

    return boolValue === 'true';
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
        notice('ℹ️ No custom emoji mapping provided, using default emojis.');
        return map;
    }

    if (typeof value === 'string') {
        let userMap;
        try {
            userMap = parse(value);
        } catch (error) {
            setFailed(`❌ Failed to parse user-provided EVENT_EMOJI_MAP YAML: ${error.message}`);
            process.exit(1);
        }

        Object.keys(userMap).forEach(event => {
            let userValue = userMap[event];
            // If the value is a string, attempt to parse it as YAML to handle nested objects
            if (typeof userValue === 'string') {
                try {
                    userValue = parse(userValue);
                } catch (error) {
                    setFailed(`❌ Failed to parse nested YAML structure in EVENT_EMOJI_MAP for "${event}": ${error.message}`);
                    process.exit(1);
                }
            }
            if (typeof map[event] === 'object' && typeof userValue === 'string') {
                setFailed(`❌ EVENT_EMOJI_MAP for "${event}" must be an object, not a string`);
                process.exit(1);
            }
            if (typeof map[event] === 'object' && typeof userValue === 'object') {
                Object.assign(map[event], userValue);
            } else {
                map[event] = userValue;
            }
        });
    }

    notice(`🔣 Using event emoji map keys: ${JSON.stringify(map)}`);
    return map;
}

// Load inputs from GitHub Actions
const username = getInput('GITHUB_USERNAME', { required: true });
const token = getInput('GITHUB_TOKEN', { required: true });
const eventLimit = processEventLimit(getInput('EVENT_LIMIT'));
const style = processStyle(getInput('OUTPUT_STYLE'));
const ignoreEvents = processIgnoreEvents(getInput('IGNORE_EVENTS'));
const hideDetailsOnPrivateRepos = processBooleanInput(getInput('HIDE_DETAILS_ON_PRIVATE_REPOS'), 'HIDE_DETAILS_ON_PRIVATE_REPOS');
const readmePath = getInput('README_PATH');
const commitMessage = getInput('COMMIT_MESSAGE');
const eventEmojiMap = processEventEmojiMap(getInput('EVENT_EMOJI_MAP'));
const dryRun = processBooleanInput(getInput('DRY_RUN'), 'DRY_RUN');

export {
    username,
    token,
    eventLimit,
    style,
    ignoreEvents,
    hideDetailsOnPrivateRepos,
    readmePath,
    commitMessage,
    eventEmojiMap,
    dryRun,
};
