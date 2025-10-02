/**
 * Template engine for custom event formatting
 */

/**
 * Apply custom template to event data
 * @param {string} template - The template string with placeholders
 * @param {Object} data - Event data containing all available information
 * @returns {string} Formatted string with placeholders replaced
 */
function applyTemplate(template, data) {
    if (!template || typeof template !== 'string') {
        return null;
    }

    let result = template;

    // Replace all available placeholders
    const placeholders = {
        '{icon}': data.icon || '',
        '{action}': data.action || '',
        '{repo}': data.repo || '',
        '{repo_url}': data.repo_url || '',
        '{date}': data.date || '',
        '{number}': data.number || '',
        '{url}': data.url || '',
        '{ref}': data.ref || '',
        '{ref_type}': data.ref_type || ''
    };

    // Replace each placeholder with its value
    for (const [placeholder, value] of Object.entries(placeholders)) {
        result = result.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
    }

    return result;
}

/**
 * Extract event data for template processing
 * @param {Object} event - GitHub event object
 * @param {Object} eventEmojiMap - Emoji mapping for events
 * @returns {Object} Formatted data object with all template variables
 */
function extractEventData(event, eventEmojiMap) {
    const type = event.type;
    const repo = event.repo;
    const isPrivate = !event.public;
    const payload = event.payload;
    
    // Determine action
    let action = payload.pull_request
        ? (payload.pull_request.merged ? 'merged' : payload.action)
        : payload.action;
    
    // Set default action based on event type if no action is available
    if (!action) {
        switch (type) {
            case 'PushEvent':
                action = 'committed';
                break;
            case 'CreateEvent':
                action = 'created';
                break;
            case 'DeleteEvent':
                action = 'deleted';
                break;
            case 'ForkEvent':
                action = 'forked';
                break;
            case 'WatchEvent':
                action = 'watched';
                break;
            case 'StarEvent':
                action = 'starred';
                break;
            case 'PublicEvent':
                action = 'publicized';
                break;
            case 'ReleaseEvent':
                action = payload.release && payload.release.draft ? 'drafted' : 'published';
                break;
            case 'CommitCommentEvent':
                action = 'commented';
                break;
            case 'IssueCommentEvent':
                action = 'commented';
                break;
            case 'PullRequestReviewEvent':
                action = 'reviewed';
                break;
            case 'PullRequestReviewCommentEvent':
                action = 'commented';
                break;
            case 'GollumEvent':
                action = 'updated';
                break;
            default:
                action = 'performed action';
        }
    }

    // Get icon/emoji
    let icon = '';
    if (eventEmojiMap[type]) {
        if (typeof eventEmojiMap[type] === 'object' && eventEmojiMap[type][action]) {
            icon = eventEmojiMap[type][action];
        } else if (typeof eventEmojiMap[type] === 'string') {
            icon = eventEmojiMap[type];
        }
    }

    // Get repository information
    const repoName = isPrivate ? 'a private repository' : repo.name;
    const repoUrl = isPrivate ? '' : `https://github.com/${repo.name}`;

    // Get date
    const date = new Date(event.created_at).toLocaleDateString();

    // Get number (for issues/PRs)
    let number = '';
    if (payload.issue) {
        number = `#${payload.issue.number}`;
    } else if (payload.pull_request) {
        number = `#${payload.pull_request.number}`;
    }

    // Get URL
    let url = '';
    if (payload.issue) {
        url = `https://github.com/${repo.name}/issues/${payload.issue.number}`;
    } else if (payload.pull_request) {
        url = `https://github.com/${repo.name}/pull/${payload.pull_request.number}`;
    } else if (type === 'PushEvent' && payload.head) {
        url = `https://github.com/${repo.name}/commit/${payload.head}`;
    } else if (type === 'CreateEvent' && payload.ref) {
        const refType = payload.ref_type;
        if (refType === 'branch') {
            url = `https://github.com/${repo.name}/tree/${payload.ref}`;
        } else if (refType === 'tag') {
            url = `https://github.com/${repo.name}/releases/tag/${payload.ref}`;
        } else if (refType === 'repository') {
            url = `https://github.com/${repo.name}`;
        }
    }

    // Get ref and ref_type
    let ref = '';
    let refType = '';
    if (payload.ref) {
        ref = payload.ref;
        refType = payload.ref_type || '';
    }

    return {
        icon,
        action,
        repo: repoName,
        repo_url: repoUrl,
        date,
        number,
        url,
        ref,
        ref_type: refType
    };
}

module.exports = {
    applyTemplate,
    extractEventData
};
