function escapeXml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
    })[character]);
}

function plainText(value) {
    return value.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/`([^`]+)`/g, '$1');
}

function htmlText(value) {
    return escapeXml(value)
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2">$1</a>');
}

function tableCell(value) {
    return value.replace(/\|/g, '&#124;').replace(/\r?\n/g, '<br>');
}

export function wrapText(value, width = 80) {
    const lines = [];
    let line = '';
    for (const word of value.split(/\s+/u)) {
        const characters = Array.from(word);
        if (line && Array.from(line).length + characters.length + 1 > width) {
            lines.push(line);
            line = '';
        }
        while (characters.length > width) {
            lines.push(characters.splice(0, width).join(''));
        }
        if (characters.length) line += (line ? ' ' : '') + characters.join('');
    }
    if (line) lines.push(line);
    return lines.length ? lines : [''];
}

export function formatActivity(rows, { style = 'MARKDOWN', outputMode = 'list', svgOutput = false } = {}) {
    if (svgOutput || outputMode === 'svg' || style === 'SVG') {
        let y = 52;
        const textX = 20 + (String(rows.length).length + 2) * 10;
        const text = rows.map((row, index) => {
            const rowY = y;
            const lines = wrapText(plainText(row.description));
            const body = lines.map(line => {
                const element = `<text class="description" x="${textX}" y="${y}" dominant-baseline="hanging">${escapeXml(line)}</text>`;
                y += 22;
                return element;
            }).join('\n');
            y += 12;
            return `<g class="activity-row"><text class="ordinal" x="${textX - 12}" y="${rowY}" text-anchor="end" dominant-baseline="hanging">${index + 1}.</text>\n${body}</g>`;
        }).join('\n');
        return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="${y + 12}" viewBox="0 0 900 ${y + 12}" role="img" aria-labelledby="title">
<title id="title">Recent Activity</title>
<style>text { font: 16px ui-monospace, monospace; fill: #24292f; } @media (prefers-color-scheme: dark) { text { fill: #c9d1d9; } }</style>
<text x="20" y="16" dominant-baseline="hanging" font-weight="bold">Recent Activity</text>
${text}
</svg>\n`;
    }
    if (outputMode === 'table') {
        const headers = ['Date', 'Event', 'Repository', 'Description'];
        const cells = rows.map(row => [row.date, row.type, row.repoUrl ? `[${row.repo}](${row.repoUrl})` : row.repo, row.description]);
        if (style === 'HTML') {
            return `<table>\n<thead><tr>${headers.map(label => `<th>${label}</th>`).join('')}</tr></thead>\n<tbody>\n${cells.map(row => `<tr>${row.map(cell => `<td>${htmlText(cell)}</td>`).join('')}</tr>`).join('\n')}\n</tbody>\n</table>`;
        }
        return [`| ${headers.join(' | ')} |`, '| --- | --- | --- | --- |', ...cells.map(row => `| ${row.map(tableCell).join(' | ')} |`)].join('\n');
    }
    const items = rows.map((row, index) => style === 'HTML'
        ? `<li>${htmlText(row.description)}</li>`
        : `${index + 1}. ${row.description}`);
    return style === 'HTML' ? `<ol>\n${items.join('\n')}\n</ol>` : items.join('\n');
}
