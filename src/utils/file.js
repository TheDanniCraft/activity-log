import fs from 'fs';
import path from 'path';
import { notice, setFailed, warning } from '@actions/core';
import { context } from '@actions/github';
import { commitMessage, outputPath, token, dryRun, svgOutput } from '../config.js';
import { createOctokit } from './octokit.js';

// Helper function for debug output logic
function logDebugActivity(activity) {
    if (process.env.ACT) {
        notice('🚧 Act-Debug mode enabled');
    } else if (dryRun) {
        notice('🚧 Dry run mode enabled');
    }

    if (process.env.ACT || dryRun) {
        console.log(activity);
    }
}

function getRepoRelativeOutputPath(filePath) {
    const normalized = filePath.replace(/\\/g, '/');

    if (!path.isAbsolute(filePath)) {
        return normalized.replace(/^\.\//, '');
    }

    const workspace = process.env.GITHUB_WORKSPACE;
    if (workspace) {
        const normalizedWorkspace = workspace.replace(/\\/g, '/').replace(/\/+$/, '');
        if (normalized.toLowerCase().startsWith(`${normalizedWorkspace.toLowerCase()}/`)) {
            return normalized.slice(normalizedWorkspace.length + 1);
        }
    }

    // Fallback for absolute paths outside workspace context.
    return path.basename(normalized);
}

function replaceActivitySection(content, activity) {
    const startMarker = '<!--START_SECTION:activity-->';
    const endMarker = '<!--END_SECTION:activity-->';
    const start = content.indexOf(startMarker);
    const end = content.indexOf(endMarker);
    if (start === -1 || end === -1 || start > end) {
        throw new Error('Section markers not found or invalid in output file.');
    }
    const previous = content.substring(start + startMarker.length, end).trim();
    if (previous.replace(/\s+/g, ' ').trim() === activity.replace(/\s+/g, ' ').trim()) {
        return null;
    }
    return `${content.substring(0, start + startMarker.length)}\n${activity}\n${content.substring(end)}`;
}

function prepareOutput(activity) {
    const current = svgOutput && !fs.existsSync(outputPath) ? '' : fs.readFileSync(outputPath, 'utf-8');
    const updated = svgOutput ? activity : replaceActivitySection(current, activity);
    if (updated === null || updated === current) {
        notice('📄 No changes in output file, skipping...');
        logDebugActivity(activity);
        return null;
    }
    return updated;
}

// Update the requested output file and push changes.
async function updateOutput(activity) {
    try {
        if (!activity || activity.trim().length === 0) {
            warning('⚠️ No activity to update. The output file will not be changed.');
            return;
        }

        const updatedContent = prepareOutput(activity);
        if (updatedContent === null) return;

        // Log debug activity and skip update if ACT or dryRun is enabled
        if (process.env.ACT || dryRun) {
            logDebugActivity(activity);
            return;
        }

        // Use @actions/github to commit and push changes
        const octokit = createOctokit(token);
        const { owner, repo } = context.repo;
        const branch = context.ref.replace('refs/heads/', '');

        // Get the last commit SHA
        const { data: refData } = await octokit.rest.git.getRef({
            owner,
            repo,
            ref: `heads/${branch}`
        });

        const lastCommitSha = refData.object.sha;

        // Get the tree SHA
        const { data: commitData } = await octokit.rest.git.getCommit({
            owner,
            repo,
            commit_sha: lastCommitSha
        });

        const treeSha = commitData.tree.sha;

        // Create a new tree with the updated output.
        const { data: newTree } = await octokit.rest.git.createTree({
            owner,
            repo,
            base_tree: treeSha,
            tree: [{
                path: getRepoRelativeOutputPath(outputPath),
                mode: '100644',
                type: 'blob',
                content: updatedContent
            }]
        });

        notice('✅ Output generated successfully!');

        // Create a new commit with the author set to github-actions[bot]
        const { data: newCommit } = await octokit.rest.git.createCommit({
            owner,
            repo,
            message: commitMessage,
            tree: newTree.sha,
            parents: [lastCommitSha],
            author: {
                name: 'github-actions[bot]',
                email: 'github-actions[bot]@users.noreply.github.com',
                date: new Date().toISOString()
            }
        });

        // Update the reference to point to the new commit
        await octokit.rest.git.updateRef({
            owner,
            repo,
            ref: `heads/${branch}`,
            sha: newCommit.sha
        });

        // Construct the commit URL
        const commitUrl = `https://github.com/${owner}/${repo}/commit/${newCommit.sha}`;
        notice(`✅ Changes pushed to the repository! Commit: ${commitUrl}`);
    } catch (error) {
        setFailed(`❌ Error updating output: ${error.message}`);
    }
}

export {
    updateOutput,
};
