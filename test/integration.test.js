
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  applyTemplate,
  extractEventData
} from '../src/utils/templateEngine.js';

// Integration Test 1: Public GitHub event
test('Render public GitHub activity', () => {
  const event = {
    type: 'PushEvent',
    public: true,
    repo: { name: 'Chien0509/activity-log' },
    payload: {
      ref: 'refs/heads/master',
      head: 'abc123'
    },
    created_at: '2026-10-19T00:00:00Z'
  };

  const data = extractEventData(event, {}, true);

  const result = applyTemplate(
    '{action} {repo} {ref}',
    data
  );

  assert.equal(
    result,
    'Committed to Chien0509/activity-log master'
  );
});

// Integration Test 2: Private repository
test('Render private GitHub activity safely', () => {
  const event = {
    type: 'PushEvent',
    public: false,
    repo: { name: 'owner/secret-repo' },
    payload: {
      ref: 'refs/heads/main'
    },
    created_at: '2026-10-19T00:00:00Z'
  };

  const data = extractEventData(event, {}, true);

  const result = applyTemplate(
    '{action} {repo}',
    data
  );

  assert.equal(
    result,
    'Committed to a private repository'
  );

  assert.equal(data.repo_url, '');
  assert.equal(data.url, '');
  assert.equal(data.ref, '');
});

// Integration Test 3: Invalid template
test('Reject invalid activity template', () => {
  const result = applyTemplate(null, {
    action: 'Committed'
  });

  assert.equal(result, null);
});
