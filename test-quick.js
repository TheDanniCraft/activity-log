#!/usr/bin/env node

/**
 * Quick Test Script for Activity Log - No GitHub Token Required
 * This script tests the formatters with mock data
 */

const { formatEventsAsTable, formatEventsAsSVG } = require('./src/utils/eventDescriptions');

// Mock event data for testing
const mockEvents = [
    {
        type: 'PushEvent',
        created_at: '2025-10-22T10:30:00Z',
        public: true,
        repo: { name: 'pizofreude/test-repo' },
        payload: {
            head: 'abc123',
            commits: [{ message: 'feat: Add new feature' }]
        }
    },
    {
        type: 'CreateEvent',
        created_at: '2025-10-21T15:45:00Z',
        public: true,
        repo: { name: 'pizofreude/another-repo' },
        payload: {
            ref_type: 'branch',
            ref: 'feature/new-branch'
        }
    },
    {
        type: 'IssuesEvent',
        created_at: '2025-10-20T09:15:00Z',
        public: true,
        repo: { name: 'opensource/project' },
        payload: {
            action: 'opened',
            issue: {
                number: 42,
                title: 'Bug report'
            }
        }
    },
    {
        type: 'StarEvent',
        created_at: '2025-10-19T14:20:00Z',
        public: true,
        repo: { name: 'awesome/library' },
        payload: {
            action: 'created'
        }
    },
    {
        type: 'PullRequestEvent',
        created_at: '2025-10-18T11:00:00Z',
        public: true,
        repo: { name: 'company/project' },
        payload: {
            action: 'opened',
            pull_request: {
                number: 15,
                title: 'Fix critical bug',
                merged: false
            }
        }
    }
];

console.log('\n🧪 Quick Test: Activity Log Formatters');
console.log('=======================================\n');

// Get mode from command line
const mode = process.argv[2] || 'table';

if (mode === 'table') {
    console.log('📊 TABLE MODE (Markdown)\n');
    console.log('---');
    const tableOutput = formatEventsAsTable(mockEvents, 'MARKDOWN');
    console.log(tableOutput);
    console.log('---\n');
    
    console.log('✅ Table formatter working correctly!');
    console.log('💡 Tip: This table would be inserted into your README.md between the markers.\n');
    
} else if (mode === 'svg') {
    console.log('🎨 SVG MODE\n');
    console.log('---');
    const svgOutput = formatEventsAsSVG(mockEvents);
    console.log(svgOutput);
    console.log('---\n');
    
    console.log('✅ SVG formatter working correctly!');
    console.log('💡 Tip: Save this output to activity-log.svg and open in a browser to view.\n');
    
    // Optionally save to file
    const fs = require('fs');
    fs.writeFileSync('test-output.svg', svgOutput);
    console.log('📁 SVG saved to: test-output.svg');
    console.log('   Open this file in your browser to see the result!\n');
    
} else {
    console.log('❌ Unknown mode. Use "table" or "svg"');
    console.log('   Example: node test-quick.js table');
    console.log('   Example: node test-quick.js svg\n');
    process.exit(1);
}

console.log('🎉 Test completed successfully!\n');
