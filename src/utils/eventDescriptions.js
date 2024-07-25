const eventDescriptions = {
    'PushEvent': ({ repo, isPrivate, payload }) => isPrivate
        ? `📝 Committed to a private repo`
        : `📝 Committed to [${repo.name}](https://github.com/${repo.name})`,

    'IssuesEvent': {
        'opened': ({ repo, isPrivate }) => isPrivate
            ? `🆕 Opened issue in a private repo`
            : `🆕 Opened issue in [${repo.name}](https://github.com/${repo.name})`,

        'edited': ({ repo, isPrivate }) => isPrivate
            ? `🔧 Edited issue in a private repo`
            : `🔧 Edited issue in [${repo.name}](https://github.com/${repo.name})`,

        'closed': ({ repo, isPrivate }) => isPrivate
            ? `❌ Closed issue in a private repo`
            : `❌ Closed issue in [${repo.name}](https://github.com/${repo.name})`
    },

    'PullRequestEvent': {
        'opened': ({ repo, pr, isPrivate }) => isPrivate
            ? `🚀 Opened a PR in a private repo`
            : `🚀 Opened [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

        'synchronize': ({ repo, pr, isPrivate }) => isPrivate
            ? `🔄 Updated a PR in a private repo`
            : `🔄 Updated [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

        'closed': ({ repo, pr, isPrivate }) => isPrivate
            ? `❌ Closed a PR in a private repo`
            : `❌ Closed [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

        'merged': ({ repo, pr, isPrivate }) => isPrivate
            ? `✅ Merged a PR in a private repo`
            : `✅ Merged [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`
    },

    'ReleaseEvent': ({ repo, isPrivate }) => isPrivate
        ? `📦 Published release in a private repo`
        : `📦 Published release in [${repo.name}](https://github.com/${repo.name})`,

    'ForkEvent': ({ repo, isPrivate }) => isPrivate
        ? `🍴 Forked a private repo`
        : `🍴 Forked [${repo.name}](https://github.com/${repo.name})`,

    'CommitCommentEvent': ({ repo, isPrivate, payload }) => isPrivate
        ? `💬 Commented on a commit in a private repo`
        : `💬 Commented on a commit in [${repo.name}](https://github.com/${repo.name})`,

    'IssueCommentEvent': ({ repo, isPrivate }) => isPrivate
        ? `💬 Commented on an issue in a private repo`
        : `💬 Commented on an issue in [${repo.name}](https://github.com/${repo.name})`,

    'PullRequestReviewEvent': ({ repo, pr, isPrivate }) => isPrivate
        ? `🔎 Reviewed a PR in a private repo`
        : `🔎 Reviewed [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

    'PullRequestReviewCommentEvent': ({ repo, pr, isPrivate }) => isPrivate
        ? `💬 Commented on review of a PR in a private repo`
        : `💬 Commented on review of [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

    'RepositoryEvent': ({ repo, isPrivate }) => isPrivate
        ? `📋 Updated a private repo`
        : `📋 Updated [${repo.name}](https://github.com/${repo.name})`,

    'WatchEvent': ({ repo, isPrivate }) => isPrivate
        ? `🔔 Watching a private repo`
        : `🔔 Watching [${repo.name}](https://github.com/${repo.name})`,

    'StarEvent': ({ repo, isPrivate }) => isPrivate
        ? `⭐ Starred a private repo`
        : `⭐ Starred [${repo.name}](https://github.com/${repo.name})`,

    'PublicEvent': ({ repo }) => `🌍 Made Repository [${repo.name}](https://github.com/${repo.name}) public`
};

module.exports = eventDescriptions;
