function applyTemplate(template, placeholders) {
    if (!template) return null;
    
    let result = template;
    
    // Replace each placeholder with its value
    for (const [placeholder, value] of Object.entries(placeholders)) {
        // First try with the exact placeholder (with curly braces)
        result = result.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), value);
        // Then try with just the placeholder name (for backward compatibility)
        result = result.replace(new RegExp(placeholder, 'g'), value);
    }
    
    return result;
}

function getActionFromEvent(type, payload) {
    // Determine action from payload
    let action = payload.pull_request
        ? (payload.pull_request.merged ? 'merged' : payload.action)
        : payload.action;
    // Set default action based on event type if no action is available
    if (!action) {
        const defaultActions = {
            'PushEvent': 'committed',
            'CreateEvent': 'created',
            'DeleteEvent': 'deleted',
            'ForkEvent': 'forked',
            'WatchEvent': 'watched',
            'StarEvent': 'starred',
            'PublicEvent': 'publicized',
            'ReleaseEvent': payload.release && payload.release.draft ? 'drafted' : 'published',
            'CommitCommentEvent': 'commented',
            'IssueCommentEvent': 'commented',
            'PullRequestReviewEvent': 'reviewed',
            'PullRequestReviewCommentEvent': 'commented',
            'GollumEvent': 'updated'
        };
        
        action = defaultActions[type] || 'performed action';
    }
    
    return action;
}

function getIconFromEvent(type, action, eventEmojiMap) {
    let icon = '';
    
    if (eventEmojiMap[type]) {
        if (typeof eventEmojiMap[type] === 'object' && eventEmojiMap[type][action]) {
            icon = eventEmojiMap[type][action];
        } else if (typeof eventEmojiMap[type] === 'string') {
            icon = eventEmojiMap[type];
        }
    }
    
    return icon;
}

function getRepoInfo(repo, isPrivate) {
    const repoName = isPrivate ? 'a private repository' : repo.name;
    const repoUrl = isPrivate ? '' : `https://github.com/${repo.name}`;
    
    return { repoName, repoUrl };
}

function getNumberFromPayload(payload) {
    if (payload.issue) {
        return `#${payload.issue.number}`;
    } else if (payload.pull_request) {
        return `#${payload.pull_request.number}`;
    }
    
    return '';
}

function getUrlFromEvent(type, payload, repoName) {
    if (payload.issue) {
        return `https://github.com/${repoName}/issues/${payload.issue.number}`;
    } else if (payload.pull_request) {
        return `https://github.com/${repoName}/pull/${payload.pull_request.number}`;
    } else if (type === 'PushEvent' && payload.head) {
        return `https://github.com/${repoName}/commit/${payload.head}`;
    } else if (type === 'CreateEvent' && payload.ref) {
        const refType = payload.ref_type;
        const urlTemplates = {
            'branch': `https://github.com/${repoName}/tree/${payload.ref}`,
            'tag': `https://github.com/${repoName}/releases/tag/${payload.ref}`,
            'repository': `https://github.com/${repoName}`
        };
        
        return urlTemplates[refType] || '';
    }
    
    return '';
}

function getRefInfo(payload) {
    if (payload.ref) {
        return {
            ref: payload.ref,
            refType: payload.ref_type || ''
        };
    }
    
    return { ref: '', refType: '' };
}

function extractEventData(event, eventEmojiMap) {
    const type = event.type;
    const repo = event.repo;
    const isPrivate = !event.public;
    const payload = event.payload;
    
    // Get action
    const action = getActionFromEvent(type, payload);
    
    // Get icon
    const icon = getIconFromEvent(type, action, eventEmojiMap);
    
    // Get repository information
    const { repoName, repoUrl } = getRepoInfo(repo, isPrivate);
    
    // Get date
    const date = new Date(event.created_at).toLocaleDateString();
    
    // Get number (for issues/PRs)
    const number = getNumberFromPayload(payload);
    
    // Get URL
    const url = getUrlFromEvent(type, payload, repo.name);
    
    // Get ref and ref_type
    const { ref, refType } = getRefInfo(payload);
    
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
