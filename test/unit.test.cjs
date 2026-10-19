// test/mock.unit.test.js
const assert = require('assert');
console.log(`[unit] TEST_ENV=${process.env.TEST_ENV || 'local'}`);
assert.strictEqual(1 + 1, 3);
console.log('mock unit tests passed');
