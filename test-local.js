#!/usr/bin/env node

/**
 * Local Testing Script for Activity Log
 * This script tests the three output modes locally without running GitHub Actions
 */

// Set up environment variables for testing
process.env.INPUT_GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'pizofreude';
process.env.INPUT_GITHUB_TOKEN = process.env.GITHUB_TOKEN || 'test-token';
process.env.INPUT_EVENT_LIMIT = '5';
process.env.INPUT_OUTPUT_STYLE = 'MARKDOWN';
process.env.INPUT_IGNORE_EVENTS = '[]';
process.env.INPUT_HIDE_DETAILS_ON_PRIVATE_REPOS = 'false';
process.env.INPUT_README_PATH = 'README.md';
process.env.INPUT_COMMIT_MESSAGE = '🧪 test: Local test run';
process.env.INPUT_EVENT_EMOJI_MAP = '';
process.env.INPUT_DRY_RUN = 'true';

// Get mode from command line argument
const mode = process.argv[2] || 'list';
process.env.INPUT_OUTPUT_MODE = mode;

console.log('\n🧪 Testing Activity Log Locally');
console.log('================================');
console.log(`Output Mode: ${mode}`);
console.log(`Username: ${process.env.INPUT_GITHUB_USERNAME}`);
console.log(`Event Limit: ${process.env.INPUT_EVENT_LIMIT}`);
console.log(`Dry Run: ${process.env.INPUT_DRY_RUN}`);
console.log('================================\n');

// Run the main script
require('./src/index.js');
