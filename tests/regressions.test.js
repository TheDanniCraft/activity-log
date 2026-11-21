import assert from 'node:assert/strict';
import { afterEach, mock, test } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const configUrl = new URL('../src/config.js', import.meta.url).href;
const octokitUrl = new URL('../src/utils/octokit.js', import.meta.url).href;
let importId = 0;
const failures = [];
const temporaryDirectories = [];

function configure(overrides = {}, getOctokit = () => {}) {
    failures.length = 0;
    mock.module('@actions/core', { namedExports: {
        warning: () => {}, notice: () => {}, setFailed: (message) => failures.push(message)
    } });
    mock.module('@actions/github', { namedExports: {
        context: { repo: { owner: 'human', repo: 'profile' }, ref: 'refs/heads/main' },
        getOctokit
    } });
    mock.module(configUrl, { namedExports: {
        username: 'human', token: 'test-token', eventLimit: 10, style: 'MARKDOWN',
        ignoreEvents: [], hideDetailsOnPrivateRepos: false, eventEmojiMap: {},
        eventTemplate: '{event_type} [{repo}]({url})', readmePath: 'README.md',
        commitMessage: 'Update activity', dryRun: false, ...overrides
    } });
}

function mockClient(rest) {
    mock.module(octokitUrl, { namedExports: { createOctokit: () => ({ rest }) } });
}

async function fresh(module) {
    return import(`../src/utils/${module}.js?regression=${++importId}`);
}

afterEach(() => {
    mock.restoreAll();
    for (const directory of temporaryDirectories.splice(0)) fs.rmSync(directory, { recursive: true });
});

const event = (type, payload = {}, extra = {}) => ({
    type, payload, public: true, repo: { name: 'human/project' },
    actor: { login: 'human' }, created_at: '2026-11-15T12:00:00Z', ...extra
});

async function activity({ events = [], starred = [], commit, config = {} } = {}) {
    configure(config);
    const getCommit = mock.fn(async () => ({ data: commit }));
    const rest = {
        activity: {
            listReposStarredByAuthenticatedUser: async ({ page }) => ({ data: page === 1 ? starred : [] }),
            listEventsForAuthenticatedUser: async ({ page }) => ({ data: page === 1 ? events : [] })
        },
        repos: { getCommit }
    };
    mockClient(rest);
    const { fetchAndFilterEvents } = await fresh('github');
    return { output: await fetchAndFilterEvents(), getCommit, rest };
}

for (const message of ['chore: Update docs', 'build(deps): Update packages', 'fix: Repair CI', 'fix: Handle dependabot configuration']) {
    test(`preserve human push: ${message}`, async () => {
        const { output } = await activity({
            events: [event('PushEvent', { head: 'human-sha' })],
            commit: { author: { login: 'human' }, committer: { login: 'human' }, commit: { message } }
        });
        assert.match(output, /PushEvent/);
    });
}

test('exclude a bot actor without looking up the commit', async () => {
    const { output, getCommit } = await activity({ events: [event('PushEvent', { head: 'bot-sha' }, { actor: { login: 'github-actions[bot]' } })] });
    assert.equal(output, '');
    assert.equal(getCommit.mock.callCount(), 0);
});

test('exclude a bot commit pushed by a human', async () => {
    const { output } = await activity({ events: [event('PushEvent', { head: 'bot-sha' })], commit: { author: { login: 'dependabot[bot]' } } });
    assert.equal(output, '');
});

const starred = [{ owner: { login: 'human' }, name: 'project' }];
for (const [ignored, stars, expected] of [
    ['StarEvent', starred, ''],
    ['WatchEvent', [], ''],
    ['WatchEvent', starred, 'StarEvent'],
    ['StarEvent', [], 'WatchEvent']
]) {
    test(`ignore ${ignored} after normalization (${stars.length ? 'starred' : 'unstarred'})`, async () => {
        const { output } = await activity({ events: [event('WatchEvent', { action: 'started' })], starred: stars, config: { ignoreEvents: [ignored] } });
        if (expected) assert.match(output, new RegExp(expected));
        else assert.equal(output, '');
    });
}

for (const style of ['MARKDOWN', 'HTML']) {
    for (const filtered of [false, true]) {
        test(`empty ${style} output preserves existing activity (${filtered ? 'all filtered' : 'no events'})`, async () => {
            const { output, rest } = await activity({ events: filtered ? [event('PublicEvent')] : [], config: { style, ignoreEvents: ['PublicEvent'] } });
            assert.equal(output, '');
            const getRef = mock.fn();
            rest.git = { getRef };
            const { updateReadme } = await fresh('file');
            await updateReadme(output);
            assert.equal(getRef.mock.callCount(), 0);
            assert.deepEqual(failures, []);
        });
    }
}

test('nonempty HTML still renders an ordered list', async () => {
    const { output } = await activity({ events: [event('PublicEvent')], config: { style: 'HTML' } });
    assert.match(output, /^<ol>\n<li>PublicEvent <a href=/);
});

const readme = (intro, activity) => `${intro}\n<!--START_SECTION:activity-->\n${activity}\n<!--END_SECTION:activity-->\nFooter\n`;

async function readmeClient({ remote = readme('New remote introduction', 'old'), dryRun = false, rejectUpdate = false } = {}) {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'activity-log-test-'));
    temporaryDirectories.push(directory);
    const readmePath = path.join(directory, 'README.md');
    fs.writeFileSync(readmePath, readme('Stale local introduction', 'old'));
    configure({ readmePath, dryRun });
    const git = {
        getRef: mock.fn(async () => ({ data: { object: { sha: 'remote-parent' } } })),
        getCommit: mock.fn(async () => ({ data: { tree: { sha: 'remote-tree' } } })),
        createTree: mock.fn(async () => ({ data: { sha: 'updated-tree' } })),
        createCommit: mock.fn(async () => ({ data: { sha: 'updated-commit' } })),
        updateRef: mock.fn(async () => { if (rejectUpdate) throw new Error('Update is not a fast forward'); })
    };
    const getContent = mock.fn(async () => ({ data: { type: 'file', encoding: 'base64', content: Buffer.from(remote).toString('base64') } }));
    mockClient({ git, repos: { getContent } });
    const { updateReadme } = await fresh('file');
    return { updateReadme, git, getContent, readmePath };
}

test('preserve remote edits outside the activity section using the exact parent SHA', async () => {
    const { updateReadme, git, getContent } = await readmeClient();
    await updateReadme('1. New activity');
    assert.equal(getContent.mock.calls[0].arguments[0].ref, 'remote-parent');
    const tree = git.createTree.mock.calls[0].arguments[0];
    assert.equal(tree.base_tree, 'remote-tree');
    assert.equal(tree.tree[0].content, readme('New remote introduction', '1. New activity'));
    assert.deepEqual(git.createCommit.mock.calls[0].arguments[0].parents, ['remote-parent']);
    assert.equal(git.updateRef.mock.calls[0].arguments[0].force, false);
    assert.deepEqual(failures, []);
});

test('skip a commit when the remote activity is already current despite a stale checkout', async () => {
    const { updateReadme, git } = await readmeClient({ remote: readme('Remote intro', '1. New activity') });
    await updateReadme('1. New activity');
    assert.equal(git.createTree.mock.callCount(), 0);
});

test('dry run reads the local README without making remote requests', async () => {
    const { updateReadme, git, getContent, readmePath } = await readmeClient({ dryRun: true });
    await updateReadme('1. New activity');
    assert.equal(git.getRef.mock.callCount(), 0);
    assert.equal(getContent.mock.callCount(), 0);
    assert.equal(fs.readFileSync(readmePath, 'utf8'), readme('Stale local introduction', 'old'));
    assert.deepEqual(failures, []);
});

test('fail safely when the remote branch advances again during the update', async () => {
    const { updateReadme, git } = await readmeClient({ rejectUpdate: true });
    await updateReadme('1. New activity');
    assert.equal(git.updateRef.mock.callCount(), 1);
    assert.match(failures[0], /not a fast forward/);
});

for (const kind of ['onRateLimit', 'onSecondaryRateLimit']) {
    test(`${kind} stops after four retries`, async () => {
        let throttle;
        configure({}, (_token, options) => { throttle = options.throttle; return {}; });
        const { createOctokit } = await fresh('octokit');
        createOctokit('test-token');
        const client = { log: { warn: mock.fn(), info: mock.fn() } };
        for (let count = 0; count < 4; count++) assert.equal(throttle[kind](60, { method: 'GET', url: '/test' }, client, count), true);
        for (const count of [4, 5, 1000000]) assert.equal(throttle[kind](60, { method: 'GET', url: '/test' }, client, count), false);
        assert.equal(client.log.info.mock.callCount(), 4);
    });
}

test('exhausted secondary rate limits propagate without another retry loop', async () => {
    configure();
    const request = mock.fn(async () => { throw Object.assign(new Error('secondary rate limit'), { status: 403 }); });
    mockClient({ activity: { listReposStarredByAuthenticatedUser: request } });
    const { fetchAndFilterEvents } = await fresh('github');
    await assert.rejects(fetchAndFilterEvents(), /secondary rate limit/);
    assert.equal(request.mock.callCount(), 1);
});
