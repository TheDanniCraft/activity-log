function applyTemplate(template, data) {
    if (!template || typeof template !== 'string') {
        return null;
    }

    let result = template;
    const placeholders = {
        '{emoji}': data.emoji || '',
        '{event_type}': data.event_type || '',
        '{action}': data.action || '',
        '{repo}': data.repo || '',
        '{repo_url}': data.repo_url || '',
        '{date}': data.date || '',
        '{number}': data.number || '',
        '{url}': data.url || '',
        '{ref}': data.ref || '',
        '{ref_type}': data.ref_type || ''
    };

    for (const [placeholder, value] of Object.entries(placeholders)) {
        result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), () => value);
    }

    // Prevent broken markdown links when URL placeholders are empty (e.g. private events).
    result = result.replace(/\[([^\]]+)\]\(\s*\)/g, '$1');

    return result.trim();
}

function getEventAction(type, payload) {
    if (type === 'ReleaseEvent') {
        return payload.release && payload.release.draft ? 'draft' : 'published';
    }

    const forcedActions = {
        WatchEvent: 'watched',
        StarEvent: 'starred',
    };
    if (forcedActions[type]) {
        return forcedActions[type];
    }

    let action = payload.pull_request
        ? (payload.pull_request.merged ? 'merged' : payload.action)
        : payload.action;

    if (action) return action;

    const defaultActions = {
        PushEvent: 'committed',
        CreateEvent: 'created',
        DeleteEvent: 'deleted',
        ForkEvent: 'forked',
        WatchEvent: 'watched',
        StarEvent: 'starred',
        PublicEvent: 'publicized',
        ReleaseEvent: payload.release && payload.release.draft ? 'draft' : 'published',
        CommitCommentEvent: 'commented',
        IssueCommentEvent: 'commented',
        PullRequestReviewEvent: 'reviewed',
        PullRequestReviewCommentEvent: 'commented',
        PullRequestReviewThreadEvent: 'commented',
        RepositoryEvent: 'updated',
        GollumEvent: 'updated',
    };

    return defaultActions[type] || 'performed action';
}

function getEventEmoji(type, action, eventEmojiMap) {
    if (!eventEmojiMap[type]) return '';

    if (typeof eventEmojiMap[type] === 'object' && eventEmojiMap[type][action]) {
        return eventEmojiMap[type][action];
    }
    if (typeof eventEmojiMap[type] === 'string') {
        return eventEmojiMap[type];
    }
    return '';
}

function getFormattedDate(isoDate) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
    }).format(new Date(isoDate));
}

function getEventNumber(payload, isPrivate) {
    if (isPrivate) return '';
    if (payload.issue) return `#${payload.issue.number}`;
    if (payload.pull_request) return `#${payload.pull_request.number}`;
    return '';
}

function getEventUrl(type, payload, repoName, isPrivate) {
    if (isPrivate) return '';

    if (type === 'CommitCommentEvent' && payload.comment) {
        const commitUrl = `https://github.com/${repoName}/commit/${payload.comment.commit_id}`;
        return `${commitUrl}#commitcomment-${payload.comment.id}`;
    }
    if (type === 'IssueCommentEvent' && payload.comment?.id && payload.issue?.number) {
        return `https://github.com/${repoName}/issues/${payload.issue.number}#issuecomment-${payload.comment.id}`;
    }
    if (type === 'PullRequestReviewEvent') {
        return payload.review?.html_url || (payload.pull_request?.number
            ? `https://github.com/${repoName}/pull/${payload.pull_request.number}`
            : '');
    }
    if (type === 'PullRequestReviewCommentEvent' && payload.comment?.id && payload.pull_request?.number) {
        return `https://github.com/${repoName}/pull/${payload.pull_request.number}#pullrequestreviewcomment-${payload.comment.id}`;
    }
    if (type === 'PullRequestReviewThreadEvent' && payload.thread?.id && payload.pull_request?.number) {
        return `https://github.com/${repoName}/pull/${payload.pull_request.number}#discussion_r_${payload.thread.id}`;
    }
    if (payload.issue?.number) {
        return `https://github.com/${repoName}/issues/${payload.issue.number}`;
    }
    if (payload.pull_request?.number) {
        return `https://github.com/${repoName}/pull/${payload.pull_request.number}`;
    }
    if (type === 'PushEvent' && payload.head) {
        return `https://github.com/${repoName}/commit/${payload.head}`;
    }
    if (type === 'CreateEvent') {
        if (payload.ref_type === 'branch' && payload.ref) {
            return `https://github.com/${repoName}/tree/${payload.ref}`;
        }
        if (payload.ref_type === 'tag' && payload.ref) {
            return `https://github.com/${repoName}/releases/tag/${payload.ref}`;
        }
        if (payload.ref_type === 'repository') {
            return `https://github.com/${repoName}`;
        }
        return '';
    }
    if (type === 'ReleaseEvent' && payload.release?.tag_name) {
        return `https://github.com/${repoName}/releases/tag/${payload.release.tag_name}`;
    }

    return '';
}

function getEventRef(payload, isPrivate, hideDetailsOnPrivateRepos) {
    if (isPrivate && hideDetailsOnPrivateRepos) {
        return '';
    }
    return payload.ref || '';
}

function extractEventData(event, eventEmojiMap, hideDetailsOnPrivateRepos = false) {
    const type = event.type;
    const repo = event.repo;
    const isPrivate = !event.public;
    const payload = event.payload;
    const action = getEventAction(type, payload);
    const emoji = getEventEmoji(type, action, eventEmojiMap);

    const repoName = isPrivate ? 'a private repository' : repo.name;
    const repoUrl = isPrivate ? '' : `https://github.com/${repo.name}`;
    const date = getFormattedDate(event.created_at);
    const number = getEventNumber(payload, isPrivate);
    const url = getEventUrl(type, payload, repo.name, isPrivate);
    const ref = getEventRef(payload, isPrivate, hideDetailsOnPrivateRepos);

    return {
        emoji,
        event_type: type,
        action,
        repo: repoName,
        repo_url: repoUrl,
        date,
        number,
        url,
        ref,
        ref_type: payload.ref_type || '',
    };
}

export {
    applyTemplate,
    extractEventData,
    getEventAction,
};
