const assert = require('assert');

console.log('🧪 Running Integration Tests...');
const env = process.env.TEST_ENV || 'development';
console.log(`Current Test Environment: ${env}`);

// 驗證環境變數是否存在
assert.ok(process.env.TEST_ENV, 'TEST_ENV environment variable must be defined');
console.log('✅ Integration tests passed with environment:', env);
