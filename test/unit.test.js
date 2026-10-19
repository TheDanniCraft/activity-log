
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  applyTemplate,
  extractEventData,
  getEventAction
} from '../src/utils/templateEngine.js';

test('Replace template placeholders', () => {
  const result = applyTemplate(
    '{emoji} {action} {repo}',
    {
      emoji: '🚀',
      action: 'Pushed',
      repo: 'Chien0509/activity-log'
    }
  );

  assert.equal(
    result,
    '🚀 Pushed Chien0509/activity-log'
  );
});

test('Reject invalid templates', () => {
  assert.equal(applyTemplate('', {}), null);
  assert.equal(applyTemplate(null, {}), null);
});

test('Handle missing placeholders', () => {
  const result = applyTemplate(
    'Hello {action} world',
    { action: '' }
  );

  assert.equal(result, 'Hello world');
});

test('Detect push action', () => {
  assert.equal(
    getEventAction('PushEvent', {}),
    'committed'
  );
});

test('Detect merged pull request', () => {
  assert.equal(
    getEventAction('PullRequestEvent', {
      action: 'closed',
      pull_request: { merged: true }
    }),
    'merged'
  );
});

test('Protect private repository data', () => {
  const event = {
    type: 'PushEvent',
    public: false,
    repo: { name: 'owner/private-repo' },
    payload: { ref: 'refs/heads/main' },
    created_at: '2026-10-19T00:00:00Z'
  };

  const result = extractEventData(event, {}, true);

  assert.equal(result.repo, 'a private repository');
  assert.equal(result.repo_url, '');
  assert.equal(result.url, '');
  assert.equal(result.ref, '');
});

test('CI failure simulation', () => {
  assert.notEqual(
    process.env.FORCE_TEST_FAILURE,
    'true',
    'Intentional failure for CI demonstration'
  );
});
