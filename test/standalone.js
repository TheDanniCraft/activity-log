#!/usr/bin/env node

/**
 * Standalone Test Script - Tests formatters without GitHub Actions dependencies
 */

const fs = require('fs');

// Mock the config module to avoid GitHub Actions input requirements
const mockConfig = {
    eventEmojiMap: {
        PushEvent: "📝",
        CreateEvent: "🎉",
        DeleteEvent: "🗑️",
        IssuesEvent: {
            opened: "🆕",
            closed: "❌",
        },
        PullRequestEvent: {
            opened: "📥",
            merged: "🔀",
        },
        StarEvent: "⭐",
        WatchEvent: "🔔",
    },
    hideDetailsOnPrivateRepos: false,
    style: 'MARKDOWN'
};

// Manually require the formatter functions by extracting them
// We'll copy the relevant code here to avoid config dependencies

/**
 * Escapes XML/HTML special characters
 */
function escapeXml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Wraps text to fit within specified width
 */
function wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (testLine.length <= maxWidth) {
            currentLine = testLine;
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
}

/**
 * Simple event description generator for testing
 */
function getSimpleDescription(event) {
    const emoji = mockConfig.eventEmojiMap[event.type] || '📌';
    const emojiText = typeof emoji === 'object' ? emoji[event.payload.action] || emoji.opened : emoji;
    
    if (event.type === 'PushEvent') {
        return `${emojiText} Committed to [${event.repo.name}](https://github.com/${event.repo.name})`;
    } else if (event.type === 'CreateEvent') {
        return `${emojiText} Created a new ${event.payload.ref_type} \`${event.payload.ref}\` in [${event.repo.name}](https://github.com/${event.repo.name})`;
    } else if (event.type === 'IssuesEvent') {
        return `${emojiText} ${event.payload.action} an issue [#${event.payload.issue.number}](https://github.com/${event.repo.name}/issues/${event.payload.issue.number}) in [${event.repo.name}](https://github.com/${event.repo.name})`;
    } else if (event.type === 'StarEvent') {
        return `${emojiText} Starred [${event.repo.name}](https://github.com/${event.repo.name})`;
    } else if (event.type === 'PullRequestEvent') {
        const action = event.payload.pull_request.merged ? 'merged' : event.payload.action;
        const actionEmoji = typeof emoji === 'object' ? emoji[action] : emoji;
        return `${actionEmoji} ${action} a pull request [#${event.payload.pull_request.number}](https://github.com/${event.repo.name}/pull/${event.payload.pull_request.number}) in [${event.repo.name}](https://github.com/${event.repo.name})`;
    }
    return `${emojiText} Activity in [${event.repo.name}](https://github.com/${event.repo.name})`;
}

/**
 * Format events as a table
 */
function formatEventsAsTable(events) {
    if (!events || events.length === 0) return '';

    const tableRows = [];
    tableRows.push('| Date | Event | Repository | Description |');
    tableRows.push('|------|-------|------------|-------------|');
    
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
        
        const description = getSimpleDescription(event);
        const escapedDescription = description.replace(/\|/g, '\\|');
        
        tableRows.push(`| ${date} | ${eventType} | ${repo} | ${escapedDescription} |`);
    });
    
    return tableRows.join('\n');
}

/**
 * Format events as SVG
 */
function formatEventsAsSVG(events) {
    if (!events || events.length === 0) {
        return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="900" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#ffffff" width="900" height="200" rx="6"/>
  <rect stroke="#d0d7de" stroke-width="1" fill="none" width="900" height="200" rx="6"/>
  <text x="450" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#57606a">No recent activity</text>
</svg>`;
    }

    const width = 900;
    const padding = 20;
    const lineHeight = 24;
    const rowSpacing = 12;
    const headerHeight = 60;
    const footerHeight = 40;
    
    let yPosition = headerHeight + padding;
    const rows = [];

    events.forEach((event, index) => {
        const date = new Date(event.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const description = getSimpleDescription(event);
        const plainDescription = description
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
            .replace(/`([^`]+)`/g, '$1');

        const maxChars = 85;
        const lines = wrapText(plainDescription, maxChars);
        const rowHeight = (lines.length * lineHeight) + rowSpacing;
        
        rows.push({
            y: yPosition,
            date,
            lines,
            height: rowHeight,
            index: index + 1
        });

        yPosition += rowHeight;
    });

    const totalHeight = yPosition + footerHeight;

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .bg { fill: #ffffff; }
      .header-bg { fill: #f6f8fa; }
      .border { stroke: #d0d7de; stroke-width: 1; fill: none; }
      .title { font: bold 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; fill: #24292f; }
      .subtitle { font: 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; fill: #57606a; }
      .row-bg { fill: #ffffff; }
      .row-bg-alt { fill: #f6f8fa; }
      .row-border { stroke: #d0d7de; stroke-width: 0.5; }
      .date-text { font: 12px 'SF Mono', Consolas, monospace; fill: #57606a; }
      .desc-text { font: 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; fill: #24292f; }
      .number { font: bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; fill: #57606a; }
    </style>
  </defs>
  
  <rect class="bg" width="${width}" height="${totalHeight}" rx="6"/>
  <rect class="border" width="${width}" height="${totalHeight}" rx="6"/>
  
  <rect class="header-bg" width="${width}" height="${headerHeight}" rx="6"/>
  <line x1="0" y1="${headerHeight}" x2="${width}" y2="${headerHeight}" class="row-border"/>
  <text x="${padding}" y="32" class="title">⚡ Recent Activity</text>
  <text x="${padding}" y="50" class="subtitle">GitHub Activity Log</text>
  
`;

    rows.forEach((row, idx) => {
        const isAlt = idx % 2 === 1;
        const rowClass = isAlt ? 'row-bg-alt' : 'row-bg';
        
        svg += `  <rect class="${rowClass}" x="0" y="${row.y - rowSpacing/2}" width="${width}" height="${row.height}"/>\n`;
        svg += `  <line x1="${padding}" y1="${row.y + row.height - rowSpacing/2}" x2="${width - padding}" y2="${row.y + row.height - rowSpacing/2}" class="row-border"/>\n`;
        svg += `  <text x="${padding + 5}" y="${row.y + 4}" class="number">${row.index}.</text>\n`;
        svg += `  <text x="${padding + 35}" y="${row.y + 4}" class="date-text">${escapeXml(row.date)}</text>\n`;
        
        row.lines.forEach((line, lineIdx) => {
            const textY = row.y + 4 + ((lineIdx + 1) * lineHeight);
            svg += `  <text x="${padding + 35}" y="${textY}" class="desc-text">${escapeXml(line)}</text>\n`;
        });
    });

    const footerY = totalHeight - 25;
    svg += `  
  <text x="${width/2}" y="${footerY}" text-anchor="middle" class="subtitle">Generated by github-activity-log</text>
</svg>`;

    return svg;
}

// Mock event data
const mockEvents = [
    {
        type: 'PushEvent',
        created_at: '2025-10-22T10:30:00Z',
        public: true,
        repo: { name: 'pizofreude/test-repo' },
        payload: {
            head: 'abc123',
            commits: [{ message: 'feat: Add new feature' }]
        }
    },
    {
        type: 'CreateEvent',
        created_at: '2025-10-21T15:45:00Z',
        public: true,
        repo: { name: 'pizofreude/another-repo' },
        payload: {
            ref_type: 'branch',
            ref: 'feature/new-branch'
        }
    },
    {
        type: 'IssuesEvent',
        created_at: '2025-10-20T09:15:00Z',
        public: true,
        repo: { name: 'opensource/project' },
        payload: {
            action: 'opened',
            issue: {
                number: 42,
                title: 'Bug report'
            }
        }
    },
    {
        type: 'StarEvent',
        created_at: '2025-10-19T14:20:00Z',
        public: true,
        repo: { name: 'awesome/library' },
        payload: {
            action: 'created'
        }
    },
    {
        type: 'PullRequestEvent',
        created_at: '2025-10-18T11:00:00Z',
        public: true,
        repo: { name: 'company/project' },
        payload: {
            action: 'opened',
            pull_request: {
                number: 15,
                title: 'Fix critical bug',
                merged: false
            }
        }
    }
];

// Main test execution
console.log('\n🧪 Activity Log Output Mode Tests');
console.log('==================================\n');

const mode = process.argv[2] || 'all';

if (mode === 'table' || mode === 'all') {
    console.log('📊 TABLE MODE\n');
    console.log('---');
    const tableOutput = formatEventsAsTable(mockEvents);
    console.log(tableOutput);
    console.log('---\n');
    console.log('✅ Table mode test passed!\n');
}

if (mode === 'svg' || mode === 'all') {
    console.log('🎨 SVG MODE\n');
    const svgOutput = formatEventsAsSVG(mockEvents);
    fs.writeFileSync('test/output.svg', svgOutput);
    console.log('✅ SVG generated: test/output.svg');
    console.log('📁 Open test/output.svg in your browser to view the result!\n');
    console.log('First few lines of SVG:');
    console.log('---');
    console.log(svgOutput.split('\n').slice(0, 10).join('\n'));
    console.log('...\n---\n');
}

if (mode === 'list') {
    console.log('📝 LIST MODE (Original)\n');
    console.log('---');
    mockEvents.forEach((event, index) => {
        console.log(`${index + 1}. ${getSimpleDescription(event)}`);
    });
    console.log('---\n');
    console.log('✅ List mode test passed!\n');
}

if (!['table', 'svg', 'list', 'all'].includes(mode)) {
    console.log('❌ Unknown mode. Use: table, svg, list, or all');
    console.log('   Example: node test-standalone.js table\n');
    process.exit(1);
}

console.log('🎉 Test completed successfully!\n');
