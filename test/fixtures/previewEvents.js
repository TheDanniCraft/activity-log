const base = { actor: { login: 'octocat' }, repo: { name: 'octocat/hello-world' }, public: true, created_at: '2026-10-31T12:00:00Z' };
const event = (id, type, payload, extra = {}) => ({ ...base, id, type, payload, ...extra });
export const previewEvents = [
    event('push-3', 'PushEvent', { ref: 'refs/heads/main', head: 'abcdef3' }),
    event('issue', 'IssuesEvent', { action: 'opened', issue: { number: 25 } }),
    event('push-2', 'PushEvent', { ref: 'refs/heads/main', head: 'abcdef2' }),
    event('merge', 'PullRequestEvent', { action: 'closed', pull_request: { number: 56, merged: true } }),
    event('push-1', 'PushEvent', { ref: 'refs/heads/main', head: 'abcdef1' }),
    event('review', 'PullRequestReviewEvent', { action: 'submitted', pull_request: { number: 73 }, review: { html_url: 'https://github.com/octocat/hello-world/pull/73#pullrequestreview-1' } }),
    event('comment', 'IssueCommentEvent', { action: 'created', issue: { number: 25 }, comment: { id: 1 } }),
    event('release', 'ReleaseEvent', { action: 'published', release: { tag_name: 'v2.0.0', html_url: 'https://github.com/octocat/hello-world/releases/tag/v2.0.0' } }),
    event('branch', 'CreateEvent', { ref_type: 'branch', ref: 'feature/activity-log' }),
    event('delete', 'DeleteEvent', { ref_type: 'branch', ref: 'feature/finished-work' }),
    event('star', 'StarEvent', {}),
    event('fork', 'ForkEvent', { forkee: { full_name: 'octocat/hello-world-fork' } }),
    event('wiki', 'GollumEvent', { pages: [{ action: 'created' }, { action: 'edited' }] }),
    event('private', 'PushEvent', { ref: 'refs/heads/internal-secret', head: 'private-sha' }, { public: false, repo: { name: 'secret/private-project' } }),
    event('long', 'PushEvent', { ref: 'refs/heads/feature/' + 'long-branch-name-'.repeat(9), head: 'abcdef4' }),
];
export const previewOptions = {
    eventTemplate: '{emoji} {action} {subject} {ref} {number} {verb} [{repo}]({url}) on {date}',
    hideDetailsOnPrivateRepos: true,
    eventEmojiMap: {
        PushEvent: '📝', IssuesEvent: { opened: '🆕' }, PullRequestEvent: { merged: '🔀' },
        PullRequestReviewEvent: '🔎', IssueCommentEvent: '🗣', ReleaseEvent: { published: '🚀' },
        CreateEvent: '🎉', DeleteEvent: '🗑️', StarEvent: '⭐', ForkEvent: '🍴', GollumEvent: '📝'
    }
};
