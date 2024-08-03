const eventDescriptions = {
    'PushEvent': ({ repo, isPrivate, payload }) => {
        const commitSha = payload.commits[0].sha;
        return isPrivate
            ? '📝 Committed to a private repo'
            : `📝 Committed to [${repo.name}](https://github.com/${repo.name}/commit/${commitSha})`;
    },

    'CreateEvent': ({ repo, isPrivate, payload }) => {
        const { ref_type, ref } = payload;
        const refUrl = ref_type === 'branch'
            ? `https://github.com/${repo.name}/tree/${ref}`
            : `https://github.com/${repo.name}/releases/tag/${ref}`;

        if (ref_type === 'repository') {
            return isPrivate
                ? '🎉 Created a new private repository'
                : `🎉 Created a new repository [${repo.name}](https://github.com/${repo.name})`;
        } else {
            return isPrivate
                ? `➕ Created a new ${ref_type} \`${ref}\` in a private repo`
                : `➕ Created a new ${ref_type} [\`${ref}\`](${refUrl}) in [${repo.name}](https://github.com/${repo.name})`;
        }
    },

    'DeleteEvent': ({ repo, isPrivate, payload }) => {
        const { ref_type, ref } = payload;
        return isPrivate
            ? `🗑️ Deleted a ${ref_type} \`${ref}\` in a private repo`
            : `🗑️ Deleted a ${ref_type} \`${ref}\` in [${repo.name}](https://github.com/${repo.name})`;
    },

    'IssuesEvent': {
        'opened': ({ repo, isPrivate, payload }) => {
            const { issue } = payload;
            const issueUrl = `https://github.com/${repo.name}/issues/${issue.number}`;
            return isPrivate
                ? '🆕 Opened an issue in a private repo'
                : `🆕 Opened an issue [#${issue.number}](${issueUrl}) in [${repo.name}](https://github.com/${repo.name})`;
        },

        'edited': ({ repo, isPrivate, payload }) => {
            const { issue } = payload;
            const issueUrl = `https://github.com/${repo.name}/issues/${issue.number}`;
            return isPrivate
                ? '🔧 Edited an issue in a private repo'
                : `🔧 Edited an issue [#${issue.number}](${issueUrl}) in [${repo.name}](https://github.com/${repo.name})`;
        },

        'closed': ({ repo, isPrivate, payload }) => {
            const { issue } = payload;
            const issueUrl = `https://github.com/${repo.name}/issues/${issue.number}`;
            return isPrivate
                ? '❌ Closed an issue in a private repo'
                : `❌ Closed an issue [#${issue.number}](${issueUrl}) in [${repo.name}](https://github.com/${repo.name})`;
        },

        'reopened': ({ repo, isPrivate, payload }) => {
            const { issue } = payload;
            const issueUrl = `https://github.com/${repo.name}/issues/${issue.number}`;
            return isPrivate
                ? '🔄 Reopened an issue in a private repo'
                : `🔄 Reopened an issue [#${issue.number}](${issueUrl}) in [${repo.name}](https://github.com/${repo.name})`;
        },

        'assigned': ({ repo, isPrivate, payload }) => {
            const { issue } = payload;
            const issueUrl = `https://github.com/${repo.name}/issues/${issue.number}`;
            return isPrivate
                ? '👤 Assigned an issue in a private repo'
                : `👤 Assigned an issue [#${issue.number}](${issueUrl}) in [${repo.name}](https://github.com/${repo.name})`;
        },

        'unassigned': ({ repo, isPrivate, payload }) => {
            const { issue } = payload;
            const issueUrl = `https://github.com/${repo.name}/issues/${issue.number}`;
            return isPrivate
                ? '👤 Unassigned an issue in a private repo'
                : `👤 Unassigned an issue [#${issue.number}](${issueUrl}) in [${repo.name}](https://github.com/${repo.name})`;
        },

        'labeled': ({ repo, isPrivate, payload }) => {
            const { issue } = payload;
            const issueUrl = `https://github.com/${repo.name}/issues/${issue.number}`;
            return isPrivate
                ? '🏷️ Added a label to an issue in a private repo'
                : `🏷️ Added a label to an issue [#${issue.number}](${issueUrl}) in [${repo.name}](https://github.com/${repo.name})`;
        },

        'unlabeled': ({ repo, isPrivate, payload }) => {
            const { issue } = payload;
            const issueUrl = `https://github.com/${repo.name}/issues/${issue.number}`;
            return isPrivate
                ? '🏷️ Removed a label from an issue in a private repo'
                : `🏷️ Removed a label from an issue [#${issue.number}](${issueUrl}) in [${repo.name}](https://github.com/${repo.name})`;
        }
    },

    'PullRequestEvent': {
        'opened': ({ repo, pr, isPrivate }) => isPrivate
            ? '📥 Opened a PR in a private repo'
            : `📥 Opened [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

        'edited': ({ repo, pr, isPrivate }) => isPrivate
            ? '📝 Edited a PR in a private repo'
            : `📝 Edited [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

        'closed': ({ repo, pr, isPrivate }) => isPrivate
            ? '❌ Closed a PR in a private repo'
            : `❌ Closed [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

        'merged': ({ repo, pr, isPrivate }) => isPrivate
            ? '🔀 Merged a PR in a private repo'
            : `🔀 Merged [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

        'reopened': ({ repo, pr, isPrivate }) => isPrivate
            ? '🔄 Reopened a PR in a private repo'
            : `🔄 Reopened [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

        'assigned': ({ repo, pr, isPrivate }) => isPrivate
            ? '👤 Assigned a PR in a private repo'
            : `👤 Assigned [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

        'unassigned': ({ repo, pr, isPrivate }) => isPrivate
            ? '👤 Unassigned a PR in a private repo'
            : `👤 Unassigned [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

        'review_requested': ({ repo, pr, isPrivate }) => isPrivate
            ? '🔍 Requested a review for a PR in a private repo'
            : `🔍 Requested a review for [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

        'review_request_removed': ({ repo, pr, isPrivate }) => isPrivate
            ? '🔍 Removed a review request for a PR in a private repo'
            : `🔍 Removed a review request for [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

        'labeled': ({ repo, pr, isPrivate }) => {
            return isPrivate
                ? '🏷️ Added a label to a PR in a private repo'
                : `🏷️ Added a label to [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`;
        },

        'unlabeled': ({ repo, pr, isPrivate }) => {
            return isPrivate
                ? '🏷️ Removed a label from a PR in a private repo'
                : `🏷️ Removed a label from [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`;
        },

        'synchronize': ({ repo, pr, isPrivate }) => isPrivate
            ? '🔄 Synchronized a PR in a private repo'
            : `🔄 Synchronized [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`
    },

    'ReleaseEvent': ({ repo, isPrivate, payload }) => {
        const { release } = payload;
        const releaseUrl = `https://github.com/${repo.name}/releases/tag/${release.tag_name}`;
        return release.draft
            ? (isPrivate
                ? '✏️ Created a draft release in a private repo'
                : `✏️ Created a draft release in [${repo.name}](https://github.com/${repo.name})`)
            : (isPrivate
                ? '🚀 Published release in a private repo'
                : `🚀 Published release [\`${release.tag_name}\`](${releaseUrl}) in [${repo.name}](https://github.com/${repo.name})`);
    },

    'ForkEvent': ({ repo, isPrivate }) => isPrivate
        ? '🍴 Forked a private repo'
        : `🍴 Forked [${repo.name}](https://github.com/${repo.name})`,

    'CommitCommentEvent': ({ repo, isPrivate, payload }) => {
        const { comment } = payload;
        const commitUrl = `https://github.com/${repo.name}/commit/${comment.commit_id}`;
        const commentUrl = `${commitUrl}#commitcomment-${comment.id}`;
        return isPrivate
            ? `🗣 Commented on a commit in a private repo`
            : `🗣 Commented on [\`${comment.commit_id}\`](${commentUrl}) in [${repo.name}](https://github.com/${repo.name})`;
    },

    'IssueCommentEvent': ({ repo, isPrivate, payload }) => {
        const { comment } = payload;
        const issueNumber = comment.issue_url.split('/').pop(); // Extract issue number from URL
        const issueUrl = `https://github.com/${repo.name}/issues/${issueNumber}`;
        const commentUrl = `${issueUrl}#issuecomment-${comment.id}`;
        return isPrivate
            ? '🗣 Commented on an issue in a private repo'
            : `🗣 Commented on issue [#${issueNumber}](${issueUrl}) in [${repo.name}](https://github.com/${repo.name}): [View Comment](${commentUrl})`;
    },

    'PullRequestReviewEvent': ({ repo, pr, isPrivate }) => isPrivate
        ? '🔎 Reviewed a PR in a private repo'
        : `🔎 Reviewed [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

    'PullRequestReviewCommentEvent': ({ repo, pr, isPrivate, payload }) => {
        const { comment } = payload;
        const prUrl = `https://github.com/${repo.name}/pull/${pr.number}`;
        const commentUrl = `${prUrl}#pullrequestreviewcomment-${comment.id}`;
        return isPrivate
            ? `🗣 Commented on a review of a PR in a private repo`
            : `🗣 Commented on a review of [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name}): [View Comment](${commentUrl})`;
    },

    'PullRequestReviewThreadEvent': ({ repo, pr, isPrivate, payload }) => {
        const { action, thread } = payload;
        const prUrl = `https://github.com/${repo.name}/pull/${pr.number}`;
        const threadUrl = `${prUrl}#discussion_r_${thread.id}`;
        return isPrivate
            ? `🧵 Marked thread ${action} in a private repo`
            : `🧵 Marked thread ${action} in [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name}): [View Thread](${threadUrl})`;
    },

    'RepositoryEvent': ({ repo, isPrivate }) => isPrivate
        ? '📋 Updated a private repo'
        : `📋 Updated [${repo.name}](https://github.com/${repo.name})`,

    'WatchEvent': ({ repo, isPrivate }) => isPrivate
        ? '🔔 Watching a private repo'
        : `🔔 Watching [${repo.name}](https://github.com/${repo.name})`,

    'StarEvent': ({ repo, isPrivate }) => isPrivate
        ? '⭐ Starred a private repo'
        : `⭐ Starred [${repo.name}](https://github.com/${repo.name})`,

    'PublicEvent': ({ repo }) => `🌍 Made repository [${repo.name}](https://github.com/${repo.name}) public`,

    'SponsorshipEvent': ({ repo, isPrivate, payload }) => {
        const { sponsorship } = payload;
        const sponsorUrl = `https://github.com/${sponsorship.sponsor.login}`;
        const sponsoredUrl = `https://github.com/${repo.name}`;
        return isPrivate
            ? '🤝 Supported a sponsor in a private repo'
            : `🤝 Sponsored [${sponsorship.sponsor.login}](${sponsorUrl}) for [${repo.name}](${sponsoredUrl})`;
    }
};

module.exports = eventDescriptions;
