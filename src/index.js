import { fetchAndFilterEvents } from './utils/github.js';
import { updateReadme } from './utils/file.js';
import { username, token, eventLimit, ignoreEvents, readmePath } from './config.js';
import { setFailed } from '@actions/core';

function buildWorkflowLink() {
    const serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com';
    const repository = process.env.GITHUB_REPOSITORY;
    const workflowRef = process.env.GITHUB_WORKFLOW_REF;

    if (!repository) return '';

    // Example: owner/repo/.github/workflows/update-activity.yml@refs/heads/master
    if (workflowRef && workflowRef.includes('/.github/workflows/')) {
        const workflowPath = workflowRef.split('@')[0].split('/').slice(2).join('/');
        const workflowFile = workflowPath.replace('.github/workflows/', '');
        if (workflowFile) {
            return `${serverUrl}/${repository}/actions/workflows/${workflowFile}`;
        }
    }

    return `${serverUrl}/${repository}/actions`;
}

function buildActionRunUrl() {
    const serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com';
    const repository = process.env.GITHUB_REPOSITORY;
    const runId = process.env.GITHUB_RUN_ID;

    if (!repository || !runId) return '';
    return `${serverUrl}/${repository}/actions/runs/${runId}`;
}

function buildBugReportUrl() {
    const issueUrl = new URL('https://github.com/TheDanniCraft/activity-log/issues/new?template=%F0%9F%90%9B-bug-report.yml');

    const workflowLink = buildWorkflowLink();
    const actionRunUrl = buildActionRunUrl();

    if (workflowLink) issueUrl.searchParams.set('workflow-link', workflowLink);
    if (actionRunUrl) issueUrl.searchParams.set('action-run-url', actionRunUrl);

    return issueUrl.toString();
}

const ISSUE_URL = buildBugReportUrl();
const GENERIC_ERROR_MESSAGE =
    `Try again and wait a bit. If the issue persists, open an issue on the activity-log repository: ${ISSUE_URL}`;

let hasFailed = false;

function failWithSupportMessage(error) {
    if (hasFailed) return;
    hasFailed = true;
    setFailed(`âŒ ${GENERIC_ERROR_MESSAGE}`);
    if (error) {
        console.error(error);
    }
}

// Main function to execute the update process
async function main() {
    const activity = await fetchAndFilterEvents({ username, token, eventLimit, ignoreEvents });
    await updateReadme(activity, readmePath);
}

process.on('unhandledRejection', (error) => failWithSupportMessage(error));
process.on('uncaughtException', (error) => failWithSupportMessage(error));

// Execute the main function
main().catch((error) => failWithSupportMessage(error));
