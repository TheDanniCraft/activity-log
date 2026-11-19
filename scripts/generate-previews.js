import fs from 'node:fs';
import path from 'node:path';
import { buildActivityRows } from '../src/utils/activityRows.js';
import { groupActivityEvents } from '../src/utils/groupEvents.js';
import { formatActivity } from '../src/utils/formatActivity.js';
import { previewEvents, previewOptions } from '../test/fixtures/previewEvents.js';

const output = path.resolve(process.argv[2] || 'examples');
const snapshotPath = process.argv[3];
const events = snapshotPath ? JSON.parse(fs.readFileSync(snapshotPath, 'utf8')) : previewEvents;
const rows = buildActivityRows(groupActivityEvents(events), previewOptions);
fs.mkdirSync(output, { recursive: true });
const list = formatActivity(rows);
const table = formatActivity(rows, { outputMode: 'table' });
const svg = formatActivity(rows, { outputMode: 'svg' });
const htmlList = formatActivity(rows, { style: 'HTML' });
const htmlTable = formatActivity(rows, { style: 'HTML', outputMode: 'table' });
for (const [name, content] of Object.entries({ 'list.md': list, 'table.md': table, 'activity.svg': svg, 'list-fragment.html': htmlList, 'table-fragment.html': htmlTable })) {
    fs.writeFileSync(path.join(output, name), content + '\n');
}
const label = snapshotPath ? 'Saved event snapshot' : 'Synthetic event fixture';
const page = (title, body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title>
<style>
:root { color-scheme: light dark; --bg: #fff; --fg: #24292f; --border: #d0d7de; --link: #0969da; }
@media (prefers-color-scheme: dark) { :root { --bg: #0d1117; --fg: #c9d1d9; --border: #30363d; --link: #58a6ff; } }
* { box-sizing: border-box; } body { background: var(--bg); color: var(--fg); margin: 0; padding: 24px; font: 14px/1.5 system-ui, sans-serif; }
main { max-width: 960px; margin: auto; } h1 { font-size: 24px; } h2 { font-size: 18px; } a { color: var(--link); } li { margin-bottom: 8px; }
section { padding: 20px; margin: 20px 0; border: 1px solid var(--border); border-radius: 6px; overflow: auto; }
table { border-collapse: collapse; table-layout: fixed; width: 100%; font-size: 12px; } th:nth-child(1) { width: 100px; } th:nth-child(2) { width: 170px; } th:nth-child(3) { width: 160px; } th, td { border: 1px solid var(--border); padding: 8px; text-align: left; overflow-wrap: anywhere; }
img { display: block; max-width: 100%; height: auto; } .meta { opacity: .7; } code { overflow-wrap: anywhere; }
</style></head><body><main><h1>${title}</h1><p class="meta">${label} · all layouts reuse the same ${rows.length} prepared rows · zero GitHub API requests</p>${body}</main></body></html>`;
const sections = {
    list: `<section><h2>Default · Markdown list</h2>${htmlList}</section>`,
    table: `<section><h2>Table · Markdown or HTML</h2>${htmlTable}</section>`,
    svg: '<section><h2>SVG · transparent image</h2><img src="activity.svg" alt="Recent activity"></section>'
};
for (const [name, body] of Object.entries(sections)) fs.writeFileSync(path.join(output, `${name}.html`), page(`${name.toUpperCase()} output`, body));
fs.writeFileSync(path.join(output, 'index.html'), page('Activity log output comparison', Object.values(sections).join('')));

console.log(`Generated all previews from one dataset in ${output}; no GitHub requests made.`);
