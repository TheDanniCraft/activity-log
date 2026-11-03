import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { groupActivityEvents } from '../src/utils/groupEvents.js';
import { formatActivity, wrapText } from '../src/utils/formatActivity.js';
import { applyTemplate, extractEventData } from '../src/utils/templateEngine.js';

const push = (id, repo = 'owner/repo', ref = 'refs/heads/main') => ({
    id, type: 'PushEvent', repo: { name: repo }, actor: { login: 'owner' },
    public: true, created_at: '2026-10-31T12:00:00Z', payload: { ref, head: id }
});
const row = { date: 'Oct 31, 2026', type: 'PushEvent', repo: 'owner/repo', repoUrl: 'https://github.com/owner/repo', description: '📝 Committed to [owner/repo](https://github.com/owner/repo)' };

test('groups nonadjacent pushes in newest-first order without mutating input', () => {
    const events = [push('3'), push('2', 'owner/other'), push('1')];
    const grouped = groupActivityEvents(events);
    assert.deepEqual(grouped.map(event => [event.id, event.count]), [['3', 2], ['2', 1]]);
    assert.equal(events[0].count, undefined);
    assert.equal(grouped[0].payload.head, '3');
});

test('separates branches, repositories, actors and visibility; deduplicates IDs', () => {
    const events = [push('1'), push('2', 'owner/other'), push('3', 'owner/repo', 'refs/heads/dev'),
        { ...push('4'), public: false }, { ...push('5'), actor: { login: 'other' } }, push('1')];
    assert.equal(groupActivityEvents(events).length, 5);
    assert.ok(groupActivityEvents(events).every(event => event.count === 1));
});

test('preserves distinct non-push events even on the same issue', () => {
    const events = ['1', '2'].map(id => ({ ...push(id), type: 'IssueCommentEvent', payload: { issue: { number: 5 } } }));
    assert.equal(groupActivityEvents(events).length, 2);
});

test('retains list output and supports HTML and table layouts', () => {
    assert.equal(formatActivity([row]), `1. ${row.description}`);
    assert.match(formatActivity([row], { style: 'HTML' }), /<ol>\n<li>📝 Committed to <a href=/);
    assert.match(formatActivity([row], { outputMode: 'table' }), /\| Date \| Event \| Repository \| Description \|/);
    assert.match(formatActivity([row], { outputMode: 'table', style: 'HTML' }), /<thead><tr><th>Date<\/th>/);
    assert.match(formatActivity([{ ...row, description: 'a | b\nc' }], { outputMode: 'table' }), /a &#124; b<br>c/);
});

test('SVG is transparent, selectable, escaped, deterministic and wraps long words', () => {
    const svg = formatActivity([{ ...row, description: '<script>& "hello" ' + 'x'.repeat(210) }], { svgOutput: true });
    assert.match(svg, /&lt;script&gt;&amp; &quot;hello&quot;/);
    assert.doesNotMatch(svg, /<script>|<rect|foreignObject/);
    assert.match(svg, /dominant-baseline="hanging"/);
    assert.ok(wrapText('x'.repeat(210)).every(line => Array.from(line).length <= 80));
    assert.equal(formatActivity([row], { svgOutput: true }), formatActivity([row], { style: 'SVG' }));
    assert.match(formatActivity([], { svgOutput: true }), /<svg/);
});

test('count templates and private metadata stay consistent across modes', () => {
    const data = extractEventData({ ...push('secret'), public: false, count: 5 }, { PushEvent: '📝' }, true);
    assert.equal(applyTemplate('{emoji} {count} pushes to [{repo}]({url}) {ref}', data), '📝 5 pushes to a private repository');
    for (const outputMode of ['list', 'table', 'svg']) {
        const output = formatActivity([{ description: applyTemplate('{repo} {ref}', data), date: data.date, type: data.event_type, repo: data.repo, repoUrl: data.repo_url }], { outputMode });
        assert.doesNotMatch(output, /owner\/repo|secret|refs\/heads/);
    }
});

function config(inputs = {}) {
    const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('INPUT_')));
    for (const [key, value] of Object.entries({ GITHUB_USERNAME: 'tester', GITHUB_TOKEN: 'dummy', EVENT_LIMIT: '10', OUTPUT_STYLE: 'MARKDOWN', ...inputs })) env[`INPUT_${key}`] = value;
    return spawnSync(process.execPath, ['--input-type=module', '-e', "const c = await import('./src/config.js'); console.log(JSON.stringify({mode:c.outputMode,path:c.outputPath,svg:c.svgOutput,group:c.groupEvents}));"], { env, encoding: 'utf8' });
}

test('configuration loads independently for each mode and keeps legacy paths', () => {
    for (const mode of ['list', 'table', 'svg']) {
        const result = config({ OUTPUT_MODE: mode });
        assert.ifError(result.error);
        assert.equal(result.status, 0, result.stderr);
        assert.match(result.stdout, new RegExp(`"mode":"${mode}"`));
    }
    assert.match(config({ README_PATH: 'legacy.md' }).stdout, /"path":"legacy.md"/);
    assert.match(config({ OUTPUT_PATH: 'new.md', README_PATH: 'legacy.md' }).stdout, /"path":"new.md"/);
    assert.match(config({ OUTPUT_STYLE: 'SVG' }).stdout, /"path":"activity-log.svg","svg":true/);
    assert.match(config({ GROUP_EVENTS: 'true' }).stdout, /"group":true/);
});

test('rejects invalid modes, booleans and incompatible extensions', () => {
    for (const inputs of [{ OUTPUT_MODE: 'bad' }, { GROUP_EVENTS: 'yes' }, { OUTPUT_MODE: 'svg', OUTPUT_PATH: 'README.md' }, { OUTPUT_PATH: 'out.svg' }, { OUTPUT_STYLE: 'SVG', OUTPUT_MODE: 'table' }]) {
        assert.notEqual(config(inputs).status, 0, JSON.stringify(inputs));
    }
});

test('fetch/group/render/commit pipeline handles pagination, filters, every mode, no-op and dry runs', () => {
    for (const mode of ['list', 'table', 'svg']) {
        for (const scenario of ['changed', 'same', 'dry']) {
            const result = spawnSync(process.execPath, ['--experimental-test-module-mocks', 'test/fixtures/run-action.mjs', mode, scenario], { encoding: 'utf8' });
            assert.ifError(result.error);
            assert.equal(result.status, 0, `${mode}/${scenario}: ${result.stderr}\n${result.stdout}`);
            assert.match(result.stdout, /Integration passed/);
        }
    }
});
