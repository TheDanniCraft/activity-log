const { eventEmojiMap } = require('../config');

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

function formatEventsAsTable(events, style = 'MARKDOWN') {
    if (!events || events.length === 0) {
        return '';
    }

    if (style === 'HTML') {
        // HTML table format
        const tableRows = events.map(event => {
            const date = new Date(event.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            const eventType = event.type.replace('Event', '');
            const repo = event.public
                ? `<a href="https://github.com/${event.repo.name}">${event.repo.name}</a>`
                : 'Private Repo';
            
            // Get the description without the emoji and list number
            const type = event.type;
            const isPrivate = !event.public;
            const action = event.payload.pull_request
                ? (event.payload.pull_request.merged ? 'merged' : event.payload.action)
                : event.payload.action;
            const pr = event.payload.pull_request || {};
            const payload = event.payload;
            const { hideDetailsOnPrivateRepos } = require('../config');

            let description = eventDescriptions[type]
                ? (typeof eventDescriptions[type] === 'function'
                    ? eventDescriptions[type]({ repo: event.repo, isPrivate, pr, payload, hideDetailsOnPrivateRepos })
                    : (eventDescriptions[type][action]
                        ? eventDescriptions[type][action]({ repo: event.repo, pr, isPrivate, payload, hideDetailsOnPrivateRepos })
                        : 'Unknown action'))
                : 'Unknown event';

            return `<tr><td>${date}</td><td>${eventType}</td><td>${repo}</td><td>${description}</td></tr>`;
        });

        return `<table><thead><tr><th>Date</th><th>Event</th><th>Repository</th><th>Description</th></tr></thead><tbody>${tableRows.join('')}</tbody></table>`;
    } else {
        // Markdown table format
        const tableRows = [];
        
        // Table header
        tableRows.push('| Date | Event | Repository | Description |');
        tableRows.push('|------|-------|------------|-------------|');
        
        // Table rows
        events.forEach(event => {
            const date = new Date(event.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            const eventType = event.type.replace('Event', '');
            const repo = event.public
                ? `[${event.repo.name}](https://github.com/${event.repo.name})`
                : 'Private Repo';
            
            // Get the description without the list number
            const type = event.type;
            const isPrivate = !event.public;
            const action = event.payload.pull_request
                ? (event.payload.pull_request.merged ? 'merged' : event.payload.action)
                : event.payload.action;
            const pr = event.payload.pull_request || {};
            const payload = event.payload;
            const { hideDetailsOnPrivateRepos } = require('../config');

            let description = eventDescriptions[type]
                ? (typeof eventDescriptions[type] === 'function'
                    ? eventDescriptions[type]({ repo: event.repo, isPrivate, pr, payload, hideDetailsOnPrivateRepos })
                    : (eventDescriptions[type][action]
                        ? eventDescriptions[type][action]({ repo: event.repo, pr, isPrivate, payload, hideDetailsOnPrivateRepos })
                        : 'Unknown action'))
                : 'Unknown event';

            // Escape pipe characters in description to avoid breaking table
            const escapedDescription = description.replace(/\|/g, '\\|');
            
            tableRows.push(`| ${date} | ${eventType} | ${repo} | ${escapedDescription} |`);
        });
        
        return tableRows.join('\n');
    }
}

function escapeXml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        let processedWord = word;
        
        // Handle words that exceed maxWidth
        if (word.length > maxWidth) {
            // Guard against maxWidth being too small for ellipsis
            if (maxWidth > 3) {
                processedWord = word.substring(0, maxWidth - 3) + '...';
            } else {
                // Edge case: maxWidth is 1-3, just truncate
                processedWord = word.substring(0, maxWidth);
            }
        }
        
        const testLine = currentLine ? `${currentLine} ${processedWord}` : processedWord;
        if (testLine.length <= maxWidth) {
            currentLine = testLine;
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = processedWord;
        }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
}

function formatEventsAsSVG(events) {
    if (!events || events.length === 0) {
        return generateEmptySVG();
    }

    // SVG layout constants
    const SVG_LAYOUT = {
        WIDTH: 900,
        HEIGHT_HEADER: 60,
        HEIGHT_ROW: 44,
        HEIGHT_FOOTER: 30,
        PADDING_LEFT: 20,
        PADDING_RIGHT: 20,
        X_NUMBER: 25,
        X_TEXT: 55,
        RADIUS: 6
    };

    const totalHeight = SVG_LAYOUT.HEIGHT_HEADER + 
                       (events.length * SVG_LAYOUT.HEIGHT_ROW) + 
                       SVG_LAYOUT.HEIGHT_FOOTER;

    const { hideDetailsOnPrivateRepos } = require('../config');
    
    // Generate SVG header
    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${SVG_LAYOUT.WIDTH}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .bg { fill: #ffffff; }
      .header-bg { fill: #f6f8fa; }
      .border { stroke: #d0d7de; stroke-width: 1; fill: none; }
      .title { font: bold 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: #24292f; }
      .subtitle { font: 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: #57606a; }
      .row-bg { fill: #ffffff; }
      .row-bg-alt { fill: #f6f8fa; }
      .row-border { stroke: #d0d7de; stroke-width: 0.5; }
      .row-text { font: 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: #24292f; }
      .number { font: bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: #57606a; }
    </style>
  </defs>
  
  <!-- Background -->
  <rect class="bg" width="${SVG_LAYOUT.WIDTH}" height="${totalHeight}" rx="${SVG_LAYOUT.RADIUS}"/>
  <rect class="border" width="${SVG_LAYOUT.WIDTH}" height="${totalHeight}" rx="${SVG_LAYOUT.RADIUS}"/>
  
  <!-- Header -->
  <rect class="header-bg" width="${SVG_LAYOUT.WIDTH}" height="${SVG_LAYOUT.HEIGHT_HEADER}" rx="${SVG_LAYOUT.RADIUS}"/>
  <line x1="0" y1="${SVG_LAYOUT.HEIGHT_HEADER}" x2="${SVG_LAYOUT.WIDTH}" y2="${SVG_LAYOUT.HEIGHT_HEADER}" class="row-border"/>
  <text x="${SVG_LAYOUT.PADDING_LEFT}" y="32" class="title">⚡ Recent Activity</text>
  <text x="${SVG_LAYOUT.PADDING_LEFT}" y="50" class="subtitle">GitHub Activity Log</text>
  
  <!-- Activity Rows -->
`;

    // Generate each event row
    events.forEach((event, index) => {
        const type = event.type;
        const isPrivate = !event.public;
        const action = event.payload.pull_request
            ? (event.payload.pull_request.merged ? 'merged' : event.payload.action)
            : event.payload.action;
        const pr = event.payload.pull_request || {};
        const payload = event.payload;

        // Get the description
        let description = eventDescriptions[type]
            ? (typeof eventDescriptions[type] === 'function'
                ? eventDescriptions[type]({ repo: event.repo, isPrivate, pr, payload, hideDetailsOnPrivateRepos })
                : (eventDescriptions[type][action]
                    ? eventDescriptions[type][action]({ repo: event.repo, pr, isPrivate, payload, hideDetailsOnPrivateRepos })
                    : 'Unknown action'))
            : 'Unknown event';

        // Strip markdown links and code backticks for plain text
        const plainDescription = description
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
            .replace(/`([^`]+)`/g, '$1');

        const y = SVG_LAYOUT.HEIGHT_HEADER + (index * SVG_LAYOUT.HEIGHT_ROW);
        const rowBg = index % 2 === 0 ? 'row-bg' : 'row-bg-alt';
        const rowCenterY = y + (SVG_LAYOUT.HEIGHT_ROW / 2);
        
        // Row background
        svg += `  <rect class="${rowBg}" x="0" y="${y}" width="${SVG_LAYOUT.WIDTH}" height="${SVG_LAYOUT.HEIGHT_ROW}"/>\n`;
        
        // Row divider
        const dividerY = y + SVG_LAYOUT.HEIGHT_ROW;
        svg += `  <line x1="${SVG_LAYOUT.PADDING_LEFT}" y1="${dividerY}" x2="${SVG_LAYOUT.WIDTH - SVG_LAYOUT.PADDING_RIGHT}" y2="${dividerY}" class="row-border"/>\n`;
        
        // Row number
        svg += `  <text x="${SVG_LAYOUT.X_NUMBER}" y="${rowCenterY}" class="number" dominant-baseline="middle">${index + 1}.</text>\n`;
        
        // Row description (single line, centered)
        svg += `  <text x="${SVG_LAYOUT.X_TEXT}" y="${rowCenterY}" class="row-text" dominant-baseline="middle">${escapeXml(plainDescription)}</text>\n`;
    });

    // Footer
    const footerY = totalHeight - 15;
    svg += `  
  <!-- Footer -->
  <text x="${SVG_LAYOUT.WIDTH / 2}" y="${footerY}" text-anchor="middle" class="subtitle">Generated by activity-log</text>
</svg>`;

    return svg;
}

function generateEmptySVG() {
    const SVG_LAYOUT = {
        WIDTH: 900,
        HEIGHT: 200,
        RADIUS: 6
    };
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${SVG_LAYOUT.WIDTH}" height="${SVG_LAYOUT.HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .bg { fill: #ffffff; }
      .border { stroke: #d0d7de; stroke-width: 1; fill: none; }
      .text { font: 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; fill: #57606a; }
    </style>
  </defs>
  <rect class="bg" width="${SVG_LAYOUT.WIDTH}" height="${SVG_LAYOUT.HEIGHT}" rx="${SVG_LAYOUT.RADIUS}"/>
  <rect class="border" width="${SVG_LAYOUT.WIDTH}" height="${SVG_LAYOUT.HEIGHT}" rx="${SVG_LAYOUT.RADIUS}"/>
  <text x="${SVG_LAYOUT.WIDTH / 2}" y="${SVG_LAYOUT.HEIGHT / 2}" text-anchor="middle" dominant-baseline="middle" class="text">No recent activity</text>
</svg>`;
}

module.exports = eventDescriptions;
module.exports.formatEventsAsTable = formatEventsAsTable;
module.exports.formatEventsAsSVG = formatEventsAsSVG;
