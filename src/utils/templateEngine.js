function applyTemplate(template, data) {
    if (!template || typeof template !== 'string') {
        return null;
    }

    let result = template;
    const placeholders = {
        '{emoji}': data.emoji || '',
        '{event_type}': data.event_type || '',
        '{action}': data.action || '',
        '{verb}': data.verb || '',
        '{subject}': data.subject || '',
        '{repo}': data.repo || '',
        '{repo_url}': data.repo_url || '',
        '{date}': data.date || '',
        '{number}': data.number || '',
        '{url}': data.url || '',
        '{ref}': data.ref || '',
        '{ref_type}': data.ref_type || ''
    };

    for (const [placeholder, value] of Object.entries(placeholders)) {
        const escaped = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (value === '') {
            // Only normalize spacing around empty placeholders, without touching unrelated literal spacing.
            result = result.replace(new RegExp(`[ \\t]*${escaped}[ \\t]*`, 'g'), ' ');
            continue;
        }
        result = result.replace(new RegExp(escaped, 'g'), () => value);
    }

    // Prevent broken markdown links when URL placeholders are empty (e.g. private events).
    result = result.replace(/\[([^\]]+)\]\(\s*\)/g, '$1');
    // Remove empty optional parenthesized segments like "({ref})" without leaving double spaces.
    result = result.replace(/\s*\(\s*\)\s*/g, ' ');

    return result.trim();
}

function getEventVerb(type, payload = {}) {
    const verbByType = {
        PushEvent: 'in',
        CreateEvent: 'in',
        DeleteEvent: 'in',
        IssuesEvent: 'in',
        PullRequestEvent: 'in',
        ReleaseEvent: 'in',
        CommitCommentEvent: 'in',
        IssueCommentEvent: 'in',
        PullRequestReviewEvent: 'in',
        PullRequestReviewCommentEvent: 'in',
        PullRequestReviewThreadEvent: 'in',
        GollumEvent: 'in',
    };

    return verbByType[type] || '';
}

function getEventSubject(type, payload = {}) {
    const issueHasNumber = Boolean(payload.issue?.number);
    const prHasNumber = Boolean(payload.pull_request?.number);
    const issueCommentIsPr = Boolean(payload.issue?.pull_request);

    const subjectByType = {
        PushEvent: '',
        IssuesEvent: issueHasNumber ? 'issue' : 'an issue',
        PullRequestEvent: prHasNumber ? 'PR' : 'a PR',
        ReleaseEvent: payload.release?.draft ? 'a draft release' : 'release',
        ForkEvent: '',
        CommitCommentEvent: 'on a commit',
        IssueCommentEvent: issueCommentIsPr
            ? (issueHasNumber ? 'on PR' : 'on a PR')
            : (issueHasNumber ? 'on issue' : 'on an issue'),
        PullRequestReviewEvent: prHasNumber ? 'PR' : 'a PR',
        PullRequestReviewCommentEvent: prHasNumber ? 'on a review of PR' : 'on a review of a PR',
        PullRequestReviewThreadEvent: 'a thread',
        RepositoryEvent: '',
        WatchEvent: '',
        StarEvent: '',
        PublicEvent: 'repository public',
        GollumEvent: (() => {
            const pages = Array.isArray(payload.pages) ? payload.pages : [];
            const pageCounts = pages.reduce((counts, page) => {
                if (page.action === 'created') counts.created += 1;
                if (page.action === 'edited') counts.edited += 1;
                return counts;
            }, { created: 0, edited: 0 });
            const totalUpdated = pageCounts.created + pageCounts.edited;
            if (totalUpdated < 1) return 'wiki pages';
            const pagesText = `${totalUpdated} page${totalUpdated > 1 ? 's' : ''}`;
            const createdText = pageCounts.created > 0
                ? ` (+${pageCounts.created} new page${pageCounts.created > 1 ? 's' : ''})`
                : '';
            return `${pagesText}${createdText}`;
        })(),
    };

    if (type === 'CreateEvent') {
        if (payload.ref_type === 'repository') return 'a new repository';
        return `a new ${payload.ref_type || 'ref'}`;
    }

    if (type === 'DeleteEvent') {
        return `a ${payload.ref_type || 'ref'}`;
    }

    return subjectByType[type] || '';
}

function getEventAction(type, payload) {
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

function toSentenceAction(action) {
    if (!action) return '';
    return action.charAt(0).toUpperCase() + action.slice(1);
}

function getDisplayAction(type, rawAction) {
    if (!rawAction) return '';

    const actionByType = {
        PushEvent: {
            committed: 'committed to',
        },
        CreateEvent: {
            created: 'created',
        },
        DeleteEvent: {
            deleted: 'deleted',
        },
        IssuesEvent: {
            opened: 'opened',
            edited: 'edited',
            closed: 'closed',
            reopened: 'reopened',
            assigned: 'assigned',
            unassigned: 'unassigned',
            labeled: 'added a label to',
            unlabeled: 'removed a label from',
        },
        PullRequestEvent: {
            opened: 'opened',
            edited: 'edited',
            closed: 'closed',
            merged: 'merged',
            reopened: 'reopened',
            assigned: 'assigned',
            unassigned: 'unassigned',
            review_requested: 'requested a review for',
            review_request_removed: 'removed a review request for',
            labeled: 'added a label to',
            unlabeled: 'removed a label from',
            synchronize: 'synchronized',
        },
        ReleaseEvent: {
            created: 'created',
            edited: 'edited',
            prereleased: 'prereleased',
            released: 'released',
            unpublished: 'unpublished',
            published: 'published',
            draft: 'draft',
        },
        ForkEvent: {
            forked: 'forked',
        },
        CommitCommentEvent: {},
        IssueCommentEvent: {},
        PullRequestReviewEvent: {
            submitted: 'reviewed',
            edited: 'edited review for',
            dismissed: 'dismissed review for',
        },
        PullRequestReviewCommentEvent: {},
        PullRequestReviewThreadEvent: {
            commented: 'marked thread',
        },
        RepositoryEvent: {
            updated: 'updated',
        },
        WatchEvent: {
            watched: 'watching',
        },
        StarEvent: {
            starred: 'starred',
        },
        PublicEvent: {
            publicized: 'made',
        },
        GollumEvent: {
            updated: 'updated',
        },
    };

    if (actionByType[type]?.[rawAction]) {
        return actionByType[type][rawAction];
    }

    if (type === 'CommitCommentEvent' || type === 'IssueCommentEvent') {
        return 'commented';
    }

    if (type === 'PullRequestReviewCommentEvent') {
        return 'commented';
    }

    return rawAction.replace(/_/g, ' ');
}

function getEventEmoji(type, action, eventEmojiMap, payload = {}) {
    if (!eventEmojiMap[type]) return '';

    if (typeof eventEmojiMap[type] === 'object') {
        if (eventEmojiMap[type][action]) {
            return eventEmojiMap[type][action];
        }
        if (type === 'ReleaseEvent') {
            // Keep release icon semantics stable even when action is created/edited/etc.
            const releaseKey = payload.release && payload.release.draft ? 'draft' : 'published';
            return eventEmojiMap[type][releaseKey] || '';
        }
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

function getCommentReviewUrl(type, payload, repoName) {
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
    return '';
}

function getIssuePrUrl(payload, repoName) {
    if (payload.issue?.number) {
        return `https://github.com/${repoName}/issues/${payload.issue.number}`;
    }
    if (payload.pull_request?.number) {
        return `https://github.com/${repoName}/pull/${payload.pull_request.number}`;
    }
    return '';
}

function getPushCreateReleaseUrl(type, payload, repoName) {
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
    if (type === 'ReleaseEvent') {
        if (payload.release?.draft) {
            return '';
        }
        if (payload.release?.html_url) {
            return payload.release.html_url;
        }
        if (payload.release?.tag_name) {
            return `https://github.com/${repoName}/releases/tag/${payload.release.tag_name}`;
        }
        return '';
    }
    return '';
}

function getEventUrl(type, payload, repoName, isPrivate) {
    if (isPrivate) return '';

    return (
        getCommentReviewUrl(type, payload, repoName) ||
        getIssuePrUrl(payload, repoName) ||
        getPushCreateReleaseUrl(type, payload, repoName) ||
        `https://github.com/${repoName}`
    );
}

function getEventRef(type, payload, isPrivate, hideDetailsOnPrivateRepos) {
    if (isPrivate && hideDetailsOnPrivateRepos) {
        return '';
    }

    if (type === 'ReleaseEvent') {
        return payload.release?.tag_name || '';
    }

    const rawRef = payload.ref || '';
    if (!rawRef) return '';

    if (type === 'PushEvent' || type === 'CreateEvent' || type === 'DeleteEvent') {
        return rawRef.replace(/^refs\/(heads|tags)\//, '');
    }

    return rawRef;
}

function extractEventData(event, eventEmojiMap, hideDetailsOnPrivateRepos = false) {
    const type = event.type;
    const repo = event.repo;
    const isPrivate = !event.public;
    const payload = event.payload;
    const rawAction = getEventAction(type, payload);
    const action = toSentenceAction(getDisplayAction(type, rawAction));
    const emoji = getEventEmoji(type, rawAction, eventEmojiMap, payload);
    const verb = getEventVerb(type, payload);
    const subject = getEventSubject(type, payload);

    const repoName = isPrivate ? 'a private repository' : repo.name;
    const repoUrl = isPrivate ? '' : `https://github.com/${repo.name}`;
    const date = getFormattedDate(event.created_at);
    const number = getEventNumber(payload, isPrivate);
    const url = getEventUrl(type, payload, repo.name, isPrivate);
    const ref = getEventRef(type, payload, isPrivate, hideDetailsOnPrivateRepos);

    return {
        emoji,
        event_type: type,
        action,
        verb,
        subject,
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

