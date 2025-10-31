/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 285:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(565);
const { parse } = __nccwpck_require__(625);

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

function processEventTemplate(value) {
    if (!value || value.trim() === '') {
        core.notice('ℹ️ No custom event template provided, using default formatting');
        return null;
    }
    const template = value.trim();
    core.notice(`📝 Using event template: ${template}`);
    return template;
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
    eventTemplate: processEventTemplate(core.getInput('EVENT_TEMPLATE')),
    dryRun: processBooleanInput(core.getInput('DRY_RUN'), 'DRY_RUN')
};


/***/ }),

/***/ 834:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { eventEmojiMap } = __nccwpck_require__(285);

const eventDescriptions = {
    'PushEvent': ({ repo, isPrivate, payload }) => {
        const commitSha = payload.head;
        return isPrivate
            ? `${eventEmojiMap['PushEvent']} Committed to a private repo`
            : `${eventEmojiMap['PushEvent']} Committed to [${repo.name}](https://github.com/${repo.name}/commit/${commitSha})`;
    },

    'CreateEvent': ({ repo, isPrivate, payload, hideDetailsOnPrivateRepos }) => {
        const { ref_type, ref } = payload;
        const refUrl = ref_type === 'branch'
            ? `https://github.com/${repo.name}/tree/${ref}`
            : `https://github.com/${repo.name}/releases/tag/${ref}`;

        if (ref_type === 'repository') {
            return isPrivate
                ? `${eventEmojiMap['CreateEvent']} Created a new private repository`
                : `${eventEmojiMap['CreateEvent']} Created a new repository [${repo.name}](https://github.com/${repo.name})`;
        } else {
            return isPrivate
                ? `${eventEmojiMap['CreateEvent']} Created a new ${ref_type}${hideDetailsOnPrivateRepos ? '' : ` \`${ref}\``} in a private repo`
                : `${eventEmojiMap['CreateEvent']} Created a new ${ref_type} [\`${ref}\`](${refUrl}) in [${repo.name}](https://github.com/${repo.name})`;
        }
    },

    'DeleteEvent': ({ repo, isPrivate, payload, hideDetailsOnPrivateRepos }) => {
        const { ref_type, ref } = payload;
        return isPrivate
            ? `${eventEmojiMap['DeleteEvent']} Deleted a ${ref_type}${hideDetailsOnPrivateRepos ? '' : ` \`${ref}\``} in a private repo`
            : `${eventEmojiMap['DeleteEvent']} Deleted a ${ref_type} \`${ref}\` in [${repo.name}](https://github.com/${repo.name})`;
    },

    'IssuesEvent': {
        'opened': ({ repo, isPrivate, payload }) => {
            const { issue } = payload;
            const issueUrl = `https://github.com/${repo.name}/issues/${issue.number}`;
            return isPrivate
                ? `${eventEmojiMap['IssuesEvent']['opened']} Opened an issue in a private repo`
                : `${eventEmojiMap['IssuesEvent']['opened']} Opened an issue [#${issue.number}](${issueUrl}) in [${repo.name}](https://github.com/${repo.name})`;
        },

        'edited': ({ repo, isPrivate, payload }) => {
            const { issue } = payload;
            const issueUrl = `https://github.com/${repo.name}/issues/${issue.number}`;
            return isPrivate
                ? `${eventEmojiMap['IssuesEvent']['edited']} Edited an issue in a private repo`
                : `${eventEmojiMap['IssuesEvent']['edited']} Edited an issue [#${issue.number}](${issueUrl}) in [${repo.name}](https://github.com/${repo.name})`;
        },

        'closed': ({ repo, isPrivate, payload }) => {
            const { issue } = payload;
            const issueUrl = `https://github.com/${repo.name}/issues/${issue.number}`;
            return isPrivate
                ? `${eventEmojiMap['IssuesEvent']['closed']} Closed an issue in a private repo`
                : `${eventEmojiMap['IssuesEvent']['closed']} Closed an issue [#${issue.number}](${issueUrl}) in [${repo.name}](https://github.com/${repo.name})`;
        },

        'reopened': ({ repo, isPrivate, payload }) => {
            const { issue } = payload;
            const issueUrl = `https://github.com/${repo.name}/issues/${issue.number}`;
            return isPrivate
                ? `${eventEmojiMap['IssuesEvent']['reopened']} Reopened an issue in a private repo`
                : `${eventEmojiMap['IssuesEvent']['reopened']} Reopened an issue [#${issue.number}](${issueUrl}) in [${repo.name}](https://github.com/${repo.name})`;
        },

        'assigned': ({ repo, isPrivate, payload }) => {
            const { issue } = payload;
            const issueUrl = `https://github.com/${repo.name}/issues/${issue.number}`;
            return isPrivate
                ? `${eventEmojiMap['IssuesEvent']['assigned']} Assigned an issue in a private repo`
                : `${eventEmojiMap['IssuesEvent']['assigned']} Assigned an issue [#${issue.number}](${issueUrl}) in [${repo.name}](https://github.com/${repo.name})`;
        },

        'unassigned': ({ repo, isPrivate, payload }) => {
            const { issue } = payload;
            const issueUrl = `https://github.com/${repo.name}/issues/${issue.number}`;
            return isPrivate
                ? `${eventEmojiMap['IssuesEvent']['unassigned']} Unassigned an issue in a private repo`
                : `${eventEmojiMap['IssuesEvent']['unassigned']} Unassigned an issue [#${issue.number}](${issueUrl}) in [${repo.name}](https://github.com/${repo.name})`;
        },

        'labeled': ({ repo, isPrivate, payload }) => {
            const { issue } = payload;
            const issueUrl = `https://github.com/${repo.name}/issues/${issue.number}`;
            return isPrivate
                ? `${eventEmojiMap['IssuesEvent']['labeled']} Added a label to an issue in a private repo`
                : `${eventEmojiMap['IssuesEvent']['labeled']} Added a label to an issue [#${issue.number}](${issueUrl}) in [${repo.name}](https://github.com/${repo.name})`;
        },

        'unlabeled': ({ repo, isPrivate, payload }) => {
            const { issue } = payload;
            const issueUrl = `https://github.com/${repo.name}/issues/${issue.number}`;
            return isPrivate
                ? `${eventEmojiMap['IssuesEvent']['unlabeled']} Removed a label from an issue in a private repo`
                : `${eventEmojiMap['IssuesEvent']['unlabeled']} Removed a label from an issue [#${issue.number}](${issueUrl}) in [${repo.name}](https://github.com/${repo.name})`;
        }
    },

    'PullRequestEvent': {
        'opened': ({ repo, pr, isPrivate }) => isPrivate
            ? `${eventEmojiMap['PullRequestEvent']['opened']} Opened a PR in a private repo`
            : `${eventEmojiMap['PullRequestEvent']['opened']} Opened [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

        'edited': ({ repo, pr, isPrivate }) => isPrivate
            ? `${eventEmojiMap['PullRequestEvent']['edited']} Edited a PR in a private repo`
            : `${eventEmojiMap['PullRequestEvent']['edited']} Edited [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

        'closed': ({ repo, pr, isPrivate }) => isPrivate
            ? `${eventEmojiMap['PullRequestEvent']['closed']} Closed a PR in a private repo`
            : `${eventEmojiMap['PullRequestEvent']['closed']} Closed [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

        'merged': ({ repo, pr, isPrivate }) => isPrivate
            ? `${eventEmojiMap['PullRequestEvent']['merged']} Merged a PR in a private repo`
            : `${eventEmojiMap['PullRequestEvent']['merged']} Merged [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

        'reopened': ({ repo, pr, isPrivate }) => isPrivate
            ? `${eventEmojiMap['PullRequestEvent']['reopened']} Reopened a PR in a private repo`
            : `${eventEmojiMap['PullRequestEvent']['reopened']} Reopened [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

        'assigned': ({ repo, pr, isPrivate }) => isPrivate
            ? `${eventEmojiMap['PullRequestEvent']['assigned']} Assigned a PR in a private repo`
            : `${eventEmojiMap['PullRequestEvent']['assigned']} Assigned [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

        'unassigned': ({ repo, pr, isPrivate }) => isPrivate
            ? `${eventEmojiMap['PullRequestEvent']['unassigned']} Unassigned a PR in a private repo`
            : `${eventEmojiMap['PullRequestEvent']['unassigned']} Unassigned [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

        'review_requested': ({ repo, pr, isPrivate }) => isPrivate
            ? `${eventEmojiMap['PullRequestEvent']['review_requested']} Requested a review for a PR in a private repo`
            : `${eventEmojiMap['PullRequestEvent']['review_requested']} Requested a review for [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

        'review_request_removed': ({ repo, pr, isPrivate }) => isPrivate
            ? `${eventEmojiMap['PullRequestEvent']['review_request_removed']} Removed a review request for a PR in a private repo`
            : `${eventEmojiMap['PullRequestEvent']['review_request_removed']} Removed a review request for [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

        'labeled': ({ repo, pr, isPrivate }) => {
            return isPrivate
                ? `${eventEmojiMap['PullRequestEvent']['labeled']} Added a label to a PR in a private repo`
                : `${eventEmojiMap['PullRequestEvent']['labeled']} Added a label to [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`;
        },

        'unlabeled': ({ repo, pr, isPrivate }) => {
            return isPrivate
                ? `${eventEmojiMap['PullRequestEvent']['unlabeled']} Removed a label from a PR in a private repo`
                : `${eventEmojiMap['PullRequestEvent']['unlabeled']} Removed a label from [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`;
        },

        'synchronize': ({ repo, pr, isPrivate }) => isPrivate
            ? `${eventEmojiMap['PullRequestEvent']['synchronize']} Synchronized a PR in a private repo`
            : `${eventEmojiMap['PullRequestEvent']['synchronize']} Synchronized [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`
    },

    'ReleaseEvent': ({ repo, isPrivate, payload }) => {
        const { release } = payload;
        const releaseUrl = `https://github.com/${repo.name}/releases/tag/${release.tag_name}`;
        return release.draft
            ? (isPrivate
                ? `${eventEmojiMap['ReleaseEvent']['draft']} Created a draft release in a private repo`
                : `${eventEmojiMap['ReleaseEvent']['draft']} Created a draft release in [${repo.name}](https://github.com/${repo.name})`)
            : (isPrivate
                ? `${eventEmojiMap['ReleaseEvent']['published']} Published release in a private repo`
                : `${eventEmojiMap['ReleaseEvent']['published']} Published release [\`${release.tag_name}\`](${releaseUrl}) in [${repo.name}](https://github.com/${repo.name})`);
    },

    'ForkEvent': ({ repo, isPrivate }) => isPrivate
        ? `${eventEmojiMap['ForkEvent']} Forked a private repo`
        : `${eventEmojiMap['ForkEvent']} Forked [${repo.name}](https://github.com/${repo.name})`,

    'CommitCommentEvent': ({ repo, isPrivate, payload }) => {
        const { comment } = payload;
        const commitUrl = `https://github.com/${repo.name}/commit/${comment.commit_id}`;
        const commentUrl = `${commitUrl}#commitcomment-${comment.id}`;
        return isPrivate
            ? `${eventEmojiMap['CommitCommentEvent']} Commented on a commit in a private repo`
            : `${eventEmojiMap['CommitCommentEvent']} Commented on [\`${comment.commit_id}\`](${commentUrl}) in [${repo.name}](https://github.com/${repo.name})`;
    },

    'IssueCommentEvent': ({ repo, isPrivate, payload }) => {
        const { comment } = payload;
        const issueNumber = comment.issue_url.split('/').pop(); // Extract issue number from URL
        const issueUrl = `https://github.com/${repo.name}/issues/${issueNumber}`;
        const commentUrl = `${issueUrl}#issuecomment-${comment.id}`;
        return isPrivate
            ? `${eventEmojiMap['IssueCommentEvent']} Commented on an issue in a private repo`
            : `${eventEmojiMap['IssueCommentEvent']} Commented on issue [#${issueNumber}](${issueUrl}) in [${repo.name}](https://github.com/${repo.name}): [View Comment](${commentUrl})`;
    },

    'PullRequestReviewEvent': ({ repo, pr, isPrivate }) => isPrivate
        ? `${eventEmojiMap['PullRequestReviewEvent']} Reviewed a PR in a private repo`
        : `${eventEmojiMap['PullRequestReviewEvent']} Reviewed [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name})`,

    'PullRequestReviewCommentEvent': ({ repo, pr, isPrivate, payload }) => {
        const { comment } = payload;
        const prUrl = `https://github.com/${repo.name}/pull/${pr.number}`;
        const commentUrl = `${prUrl}#pullrequestreviewcomment-${comment.id}`;
        return isPrivate
            ? `${eventEmojiMap['PullRequestReviewCommentEvent']} Commented on a review of a PR in a private repo`
            : `${eventEmojiMap['PullRequestReviewCommentEvent']} Commented on a review of [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name}): [View Comment](${commentUrl})`;
    },

    'PullRequestReviewThreadEvent': ({ repo, pr, isPrivate, payload }) => {
        const { action, thread } = payload;
        const prUrl = `https://github.com/${repo.name}/pull/${pr.number}`;
        const threadUrl = `${prUrl}#discussion_r_${thread.id}`;
        return isPrivate
            ? `${eventEmojiMap['PullRequestReviewThreadEvent']} Marked thread ${action} in a private repo`
            : `${eventEmojiMap['PullRequestReviewThreadEvent']} Marked thread ${action} in [PR #${pr.number}](https://github.com/${repo.name}/pull/${pr.number}) in [${repo.name}](https://github.com/${repo.name}): [View Thread](${threadUrl})`;
    },

    'RepositoryEvent': ({ repo, isPrivate }) => isPrivate
        ? `${eventEmojiMap['RepositoryEvent']} Updated a private repo`
        : `${eventEmojiMap['RepositoryEvent']} Updated [${repo.name}](https://github.com/${repo.name})`,

    'WatchEvent': ({ repo, isPrivate }) => isPrivate
        ? `${eventEmojiMap['WatchEvent']} Watching a private repo`
        : `${eventEmojiMap['WatchEvent']} Watching [${repo.name}](https://github.com/${repo.name})`,

    'StarEvent': ({ repo, isPrivate }) => isPrivate
        ? `${eventEmojiMap['StarEvent']} Starred a private repo`
        : `${eventEmojiMap['StarEvent']} Starred [${repo.name}](https://github.com/${repo.name})`,

    'PublicEvent': ({ repo }) => `${eventEmojiMap['PublicEvent']} Made repository [${repo.name}](https://github.com/${repo.name}) public`,

    'GollumEvent': ({ repo, isPrivate, payload }) => {
        const pageCounts = payload.pages.reduce((counts, page) => {
            if (page.action === 'created') {
                counts.created += 1;
            } else if (page.action === 'edited') {
                counts.edited += 1;
            }
            return counts;
        }, { created: 0, edited: 0 });

        const { created, edited } = pageCounts;
        const totalUpdated = created + edited;

        let description = '';
        if (totalUpdated > 0) {
            description = isPrivate
                ? `${eventEmojiMap['GollumEvent']} Updated ${totalUpdated} page${totalUpdated > 1 ? 's' : ''}${created > 0 ? ` (+${created} new page${created > 1 ? 's' : ''})` : ''} in a private repo`
                : `${eventEmojiMap['GollumEvent']} Updated ${totalUpdated} page${totalUpdated > 1 ? 's' : ''}${created > 0 ? ` (+${created} new page${created > 1 ? 's' : ''})` : ''} in [${repo.name}](https://github.com/${repo.name})`;
        }

        return description;
    },
};

module.exports = eventDescriptions;


/***/ }),

/***/ 491:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const fs = __nccwpck_require__(896);
const core = __nccwpck_require__(565);
const github = __nccwpck_require__(405);
const { commitMessage, readmePath, token, dryRun } = __nccwpck_require__(285);

// Helper function for debug output logic
function logDebugActivity(activity) {
    if (process.env.ACT) {
        core.notice('🚧 Act-Debug mode enabled');
    } else if (dryRun) {
        core.notice('🚧 Dry run mode enabled');
    }

    if (process.env.ACT || dryRun) {
        console.log(activity);
    }
}

// Function to update README.md and push changes
async function updateReadme(activity) {
    try {
        if (!activity || activity.trim().length === 0) {
            core.warning('⚠️ No activity to update. The README.md will not be changed.');
            return;
        }

        const readmeContent = fs.readFileSync(readmePath, 'utf-8');
        const startMarker = '<!--START_SECTION:activity-->';
        const endMarker = '<!--END_SECTION:activity-->';

        const startIdx = readmeContent.indexOf(startMarker);
        const endIdx = readmeContent.indexOf(endMarker);

        if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) {
            core.setFailed('❌ Section markers not found or invalid in README.md.');
            return;
        }

        const currentSection = readmeContent.substring(startIdx + startMarker.length, endIdx).trim();
        const updatedContent = [
            readmeContent.substring(0, startIdx + startMarker.length),
            '\n',
            activity,
            '\n',
            readmeContent.substring(endIdx)
        ].join('');

        // Don't run if section didn't change
        if (currentSection.replace(/\s+/g, ' ').trim() === activity.replace(/\s+/g, ' ').trim()) {
            core.notice('📄 No changes in README.md, skipping...');
            if (process.env.ACT || dryRun) {
                logDebugActivity(activity);
            }
            return;
        }

        // Log debug activity and skip update if ACT or dryRun is enabled
        if (process.env.ACT || dryRun) {
            logDebugActivity(activity);
            return;
        }

        // Use @actions/github to commit and push changes
        const octokit = github.getOctokit(token);
        const { owner, repo } = github.context.repo;
        const branch = github.context.ref.replace('refs/heads/', '');

        // Get the last commit SHA
        const { data: refData } = await octokit.rest.git.getRef({
            owner,
            repo,
            ref: `heads/${branch}`
        });

        const lastCommitSha = refData.object.sha;

        // Get the tree SHA
        const { data: commitData } = await octokit.rest.git.getCommit({
            owner,
            repo,
            commit_sha: lastCommitSha
        });

        const treeSha = commitData.tree.sha;

        // Create a new tree with the updated README
        const { data: newTree } = await octokit.rest.git.createTree({
            owner,
            repo,
            base_tree: treeSha,
            tree: [{
                path: readmePath.replace(/^.*[\\\/]/, ''),
                mode: '100644',
                type: 'blob',
                content: updatedContent
            }]
        });

        core.notice('✅ README.md updated successfully!');

        // Create a new commit with the author set to github-actions[bot]
        const { data: newCommit } = await octokit.rest.git.createCommit({
            owner,
            repo,
            message: commitMessage,
            tree: newTree.sha,
            parents: [lastCommitSha],
            author: {
                name: 'github-actions[bot]',
                email: 'github-actions[bot]@users.noreply.github.com',
                date: new Date().toISOString()
            }
        });

        // Update the reference to point to the new commit
        await octokit.rest.git.updateRef({
            owner,
            repo,
            ref: `heads/${branch}`,
            sha: newCommit.sha
        });

        // Construct the commit URL
        const commitUrl = `https://github.com/${owner}/${repo}/commit/${newCommit.sha}`;
        core.notice(`✅ Changes pushed to the repository! Commit: ${commitUrl}`);
    } catch (error) {
        core.setFailed(`❌ Error updating README.md: ${error.message}`);
    }
}

module.exports = {
    updateReadme,
};


/***/ }),

/***/ 330:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const github = __nccwpck_require__(405);
const core = __nccwpck_require__(565);
const eventDescriptions = __nccwpck_require__(834);
const { applyTemplate, extractEventData } = __nccwpck_require__(857);
const { username, token, eventLimit, style, ignoreEvents, hideDetailsOnPrivateRepos, eventEmojiMap, eventTemplate } = __nccwpck_require__(285);

// Create an authenticated Octokit client
const octokit = github.getOctokit(token);

// Function to fetch starred repositories with pagination
async function fetchAllStarredRepos() {
    let starredRepos = [];
    let page = 1;

    while (true) {
        try {
            const { data: pageStarredRepos } = await octokit.rest.activity.listReposStarredByAuthenticatedUser({
                per_page: 100,
                page
            });

            if (pageStarredRepos.length === 0) {
                break;
            }

            starredRepos = starredRepos.concat(pageStarredRepos);
            page++;
        } catch (error) {
            core.setFailed(`❌ Error fetching starred repositories: ${error.message}`);
            process.exit(1);
        }
    }

    // Create a set of starred repo names
    const starredRepoNames = new Set(starredRepos.map(repo => `${repo.owner.login}/${repo.name}`));

    return { starredRepoNames };
}

// Function to check if the event was likely triggered by GitHub Actions or bots
async function isTriggeredByGitHubActions(event) {
    // Regex patterns to match common GitHub Actions or bot commit messages
    const botPattern = /\[bot\]$|^github-actions$|^dependabot$|^dependabot\[bot\]$/i;

    const sha = event.payload.head;
    const fullName = event.repo.name;

    if (!sha || !fullName) return false;

    const [owner, repo] = fullName.split("/");
    const { data: commit } = await octokit.rest.repos.getCommit({
        owner,
        repo,
        ref: sha,
    });

    // Check if the commit author name matches any of the bot patterns
    const fields = [
        commit?.author?.login,
        commit?.committer?.login,
        commit?.commit?.author?.name,
        commit?.commit?.author?.email,
        commit?.commit?.committer?.name,
        commit?.commit?.committer?.email,
    ].filter(Boolean);

    const message = commit?.commit?.message || "";

    const messageLooksAutomated =
        /\bci\b|^chore(\(|:)|^build(\(|:)|dependabot/i.test(message);

    return fields.some((v) => botPattern.test(v)) || messageLooksAutomated;
}

// Helper function to encode URLs
function encodeHTML(str) {
    return str
        .replace(/`([^`]+)`/g, '<code>$1</code>') // Convert inline code (single backticks) to HTML <code> tags
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>'); // Convert [text](url) to <a href="url">text</a>
}

// Function to fetch all events with pagination and apply filtering
async function fetchEvents(page) {
    try {
        const { data: events } = await octokit.rest.activity.listEventsForAuthenticatedUser({
            username,
            per_page: 100,
            page
        });

        // Check for API rate limit or pagination issues
        if (events.length === 0) {
            core.warning('⚠️ No more events available.');
            return events; // No more events to fetch
        }

        return events;
    } catch (error) {
        core.setFailed(`❌ Error fetching events: ${error.message}`);
        process.exit(1);
    }
}

// Function to fetch and filter events
async function fetchAndFilterEvents() {
    const { starredRepoNames } = await fetchAllStarredRepos();
    let page = 1;
    let allEvents = await fetchEvents(page);

    let filteredEvents = [];

    while (filteredEvents.length < eventLimit) {
        const candidates = allEvents
            .filter(event => !ignoreEvents.includes(event.type));

        const keepFlags = await Promise.all(
            candidates.map(async (event) => !(await isTriggeredByGitHubActions(event)))
        );

        filteredEvents = candidates
            .filter((_, i) => keepFlags[i])
            .map(event => {
                if (event.type === 'WatchEvent') {
                    const isStarred = starredRepoNames.has(event.repo.name);
                    return { ...event, type: isStarred ? 'StarEvent' : 'WatchEvent' };
                }
                return event;
            })
            .slice(0, eventLimit);

        if (filteredEvents.length < eventLimit) {
            page++;
            if (page > 3) {
                core.warning(`⚠️ Due to github limitations, only the last ${allEvents.length} events (${filteredEvents.length} after filtering) will be displayed.`);
                break;
            };
            const additionalEvents = await fetchEvents(page);

            if (additionalEvents.length === 0) break;
            allEvents = allEvents.concat(additionalEvents);
        } else {
            break;
        }
    }

    filteredEvents = filteredEvents.slice(0, eventLimit);

    const fetchedEventCount = filteredEvents.length;
    const totalFetchedEvents = allEvents.length;

    if (fetchedEventCount < eventLimit) {
        core.warning(`⚠️ Only ${fetchedEventCount} events met the criteria. ${totalFetchedEvents - fetchedEventCount} events were skipped due to filters.`);
    }

    // Generate ordered list of events with descriptions
    const listItems = filteredEvents.map((event, index) => {
        const type = event.type;
        const repo = event.repo;
        const isPrivate = !event.public;
        const action = event.payload.pull_request
            ? (event.payload.pull_request.merged ? 'merged' : event.payload.action)
            : event.payload.action;

        const pr = event.payload.pull_request || {};
        const payload = event.payload;

        let description;
        
        // Use custom template if provided
        if (eventTemplate) {
            const eventData = extractEventData(event, eventEmojiMap);
            description = applyTemplate(eventTemplate, eventData);
            
            // If template returns null or empty, fall back to default formatting
            if (!description) {
                description = eventDescriptions[type]
                    ? (typeof eventDescriptions[type] === 'function'
                        ? eventDescriptions[type]({ repo, isPrivate, pr, payload, hideDetailsOnPrivateRepos })
                        : (eventDescriptions[type][action]
                            ? eventDescriptions[type][action]({ repo, pr, isPrivate, payload, hideDetailsOnPrivateRepos })
                            : core.warning(`Unknown action: ${action}`)))
                    : core.warning(`Unknown event: ${event}`);
            }
        } else {
            // Use default formatting
            description = eventDescriptions[type]
                ? (typeof eventDescriptions[type] === 'function'
                    ? eventDescriptions[type]({ repo, isPrivate, pr, payload, hideDetailsOnPrivateRepos })
                    : (eventDescriptions[type][action]
                        ? eventDescriptions[type][action]({ repo, pr, isPrivate, payload, hideDetailsOnPrivateRepos })
                        : core.warning(`Unknown action: ${action}`)))
                : core.warning(`Unknown event: ${event}`);
        }

        return style === 'MARKDOWN'
            ? `${index + 1}. ${description}`
            : `<li>${encodeHTML(description)}</li>`;
    });

    return style === 'MARKDOWN'
        ? listItems.join('\n')
        : `<ol>\n${listItems.join('\n')}\n</ol>`;
}

module.exports = {
    fetchAndFilterEvents,
};


/***/ }),

/***/ 857:
/***/ ((module) => {

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


/***/ }),

/***/ 565:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 405:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 625:
/***/ ((module) => {

module.exports = eval("require")("yaml");


/***/ }),

/***/ 896:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
const { fetchAndFilterEvents } = __nccwpck_require__(330);
const { updateReadme } = __nccwpck_require__(491);
const { username, token, eventLimit, ignoreEvents, readmePath, commitMessage } = __nccwpck_require__(285);
const core = __nccwpck_require__(565)

// Main function to execute the update process
async function main() {
    try {
        const activity = await fetchAndFilterEvents({ username, token, eventLimit, ignoreEvents });
        await updateReadme(activity, readmePath);
    } catch (error) {
        core.setFailed(`❌ Error in the update process: ${error.message}`);
        console.error(error)
        process.exit(1);
    }
}

// Execute the main function
main();

module.exports = __webpack_exports__;
/******/ })()
;