import assert from 'node:assert/strict';
import { mock } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const mode = process.argv[2];
const scenario = process.argv[3] || 'changed';
const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'activity-log-test-'));
const outputPath = path.join(workspace, mode === 'svg' ? 'images/activity.svg' : 'README.md');
Object.assign(process.env, {
    INPUT_GITHUB_USERNAME: 'tester', INPUT_GITHUB_TOKEN: 'dummy', INPUT_EVENT_LIMIT: '2',
    INPUT_OUTPUT_STYLE: 'MARKDOWN', INPUT_OUTPUT_MODE: mode, INPUT_OUTPUT_PATH: outputPath,
    INPUT_GROUP_EVENTS: 'true', INPUT_IGNORE_EVENTS: '["CreateEvent"]',
    INPUT_EVENT_TEMPLATE: '{emoji} {action} [{repo}]({url})',
    INPUT_COMMIT_MESSAGE: 'Update activity', INPUT_DRY_RUN: scenario === 'dry' ? 'true' : 'false',
    GITHUB_REPOSITORY: 'owner/automation', GITHUB_REF: 'refs/heads/main', GITHUB_WORKSPACE: workspace
});
const push = (id, repo = 'owner/repo') => ({ id, type: 'PushEvent', repo: { name: repo }, actor: { login: 'tester' }, public: true, created_at: '2026-10-31T12:00:00Z', payload: { ref: 'refs/heads/main', head: id } });
const requests = [];
const pages = [];
const fakeFetch = async (input, options = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url);
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : undefined;
    requests.push({ url: url.pathname, method, body });
    let data;
    if (url.pathname === '/user/starred') data = [];
    else if (url.pathname.includes('/events')) {
        const page = Number(url.searchParams.get('page'));
        pages.push(page);
        data = page === 1 ? [push('a'), push('b'), { ...push('ignored'), type: 'CreateEvent' }, { ...push('bot'), actor: { login: 'github-actions[bot]' } }]
            : page === 2 ? [push('c'), push('other', 'owner/other')] : [];
    } else if (url.pathname.includes('/commits/') && !url.pathname.includes('/git/')) data = { commit: { message: 'Implement feature', author: { name: 'Human' } } };
    else if (url.pathname.includes('/git/ref/')) data = { object: { sha: 'base' } };
    else if (url.pathname.endsWith('/git/commits/base')) data = { tree: { sha: 'tree' } };
    else if (url.pathname.endsWith('/git/trees')) data = { sha: 'new-tree' };
    else if (url.pathname.endsWith('/git/commits')) data = { sha: 'new-commit' };
    else if (url.pathname.includes('/git/refs/')) data = { object: { sha: 'new-commit' } };
    else throw new Error(`Unexpected request: ${method} ${url}`);
    return new Response(JSON.stringify(data), { status: 200, headers: { 'content-type': 'application/json' } });
};
async function request(url, method = 'GET', body) {
    const response = await fakeFetch(`https://api.github.com${url}`, { method, body: body && JSON.stringify(body) });
    return { data: await response.json() };
}
mock.module('../../src/utils/octokit.js', { namedExports: {
    createOctokit: () => ({ rest: {
        activity: {
            listReposStarredByAuthenticatedUser: () => request('/user/starred'),
            listEventsForAuthenticatedUser: ({ page }) => request(`/users/tester/events?page=${page}`)
        },
        repos: { getCommit: ({ ref }) => request(`/repos/owner/repo/commits/${ref}`) },
        git: {
            getRef: () => request('/repos/owner/automation/git/ref/heads/main'),
            getCommit: () => request('/repos/owner/automation/git/commits/base'),
            createTree: body => request('/repos/owner/automation/git/trees', 'POST', body),
            createCommit: body => request('/repos/owner/automation/git/commits', 'POST', body),
            updateRef: body => request('/repos/owner/automation/git/refs/heads/main', 'PATCH', body)
        }
    } })
} });
try {
    const { fetchAndFilterEvents } = await import('../../src/utils/github.js');
    const { updateOutput } = await import('../../src/utils/file.js');
    const activity = await fetchAndFilterEvents();
    assert.deepEqual(pages, [1, 2, 3]);
    assert.match(activity, /3×/);
    assert.match(activity, /owner\/other/);
    assert.doesNotMatch(activity, /ignored|bot/);
    if (mode !== 'svg' || scenario === 'same') {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, mode === 'svg' ? activity : `Before\n<!--START_SECTION:activity-->\n${scenario === 'same' ? activity : 'old'}\n<!--END_SECTION:activity-->\nAfter`);
    }
    await updateOutput(activity);
    assert.equal(process.exitCode || 0, 0);
    const writes = requests.filter(request => request.method !== 'GET');
    if (scenario === 'same' || scenario === 'dry') assert.equal(writes.length, 0);
    else {
        assert.equal(writes.length, 3);
        const entry = writes[0].body.tree[0];
        assert.equal(entry.path, mode === 'svg' ? 'images/activity.svg' : 'README.md');
        assert.equal(writes[2].body.force || false, false);
        if (mode === 'svg') assert.equal(entry.content, activity);
        else {
            assert.match(entry.content, /^Before\n<!--START_SECTION:activity-->/);
            assert.match(entry.content, /<!--END_SECTION:activity-->\nAfter$/);
        }
    }
    console.log('Integration passed');
} finally {
    fs.rmSync(workspace, { recursive: true, force: true });
}
