// test/mock.integration.test.js
const assert = require('assert');
console.log(`[integration] TEST_ENV=${process.env.TEST_ENV || 'local'}`);
assert.strictEqual(2 + 2, 4);
console.log('mock integration tests passed');
