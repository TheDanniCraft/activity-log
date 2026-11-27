import fs from 'fs';
import path from 'path';
import { notice, setFailed, warning } from '@actions/core';
import { context } from '@actions/github';
import { commitMessage, readmePath, token, dryRun } from '../config.js';
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

function getRepoRelativeReadmePath(filePath) {
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

// Function to update README.md and push changes
async function updateReadme(activity) {
    try {
        if (!activity || activity.trim().length === 0) {
            warning('⚠️ No activity to update. The README.md will not be changed.');
            return;
        }

        const preview = Boolean(process.env.ACT || dryRun);
        const octokit = preview ? null : createOctokit(token);
        const repoPath = getRepoRelativeReadmePath(readmePath);
        let owner, repo, branch, lastCommitSha, readmeContent;

        if (preview) {
            readmeContent = fs.readFileSync(readmePath, 'utf-8');
        } else {
            ({ owner, repo } = context.repo);
            branch = context.ref.replace('refs/heads/', '');
            const { data: refData } = await octokit.rest.git.getRef({
                owner, repo, ref: `heads/${branch}`
            });
            lastCommitSha = refData.object.sha;
            // Read from the exact parent commit so newer README edits are preserved.
            const { data: file } = await octokit.rest.repos.getContent({
                owner, repo, path: repoPath, ref: lastCommitSha
            });
            if (Array.isArray(file) || file.type !== 'file' || file.encoding !== 'base64') {
                throw new Error('README_PATH must point to a readable file');
            }
            readmeContent = Buffer.from(file.content, 'base64').toString('utf-8');
        }
        const startMarker = '<!--START_SECTION:activity-->';
        const endMarker = '<!--END_SECTION:activity-->';

        const startIdx = readmeContent.indexOf(startMarker);
        const endIdx = readmeContent.indexOf(endMarker);

        if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) {
            setFailed('❌ Section markers not found or invalid in README.md.');
            return;
        }

        const currentSection = readmeContent.substring(startIdx + startMarker.length, endIdx).trim();
        const updatedContent = [
            readmeContent.substring(0, startIdx + startMarker.length),
            '\n',
            activity,
            '\n',
            readmeContent.substring(endIdx)
        ].join('');

        // Don't run if section didn't change
        if (currentSection.replace(/\s+/g, ' ').trim() === activity.replace(/\s+/g, ' ').trim()) {
            notice('📄 No changes in README.md, skipping...');
            if (process.env.ACT || dryRun) {
                logDebugActivity(activity);
            }
            return;
        }

        // Log debug activity and skip update if ACT or dryRun is enabled
        if (process.env.ACT || dryRun) {
            logDebugActivity(activity);
            return;
        }

        // Get the tree SHA
        const { data: commitData } = await octokit.rest.git.getCommit({
            owner,
            repo,
            commit_sha: lastCommitSha
        });

        const treeSha = commitData.tree.sha;

        // Create a new tree with the updated README
        const { data: newTree } = await octokit.rest.git.createTree({
            owner,
            repo,
            base_tree: treeSha,
            tree: [{
                path: repoPath,
                mode: '100644',
                type: 'blob',
                content: updatedContent
            }]
        });

        notice('✅ README.md updated successfully!');

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
            sha: newCommit.sha,
            force: false
        });

        // Construct the commit URL
        const commitUrl = `https://github.com/${owner}/${repo}/commit/${newCommit.sha}`;
        notice(`✅ Changes pushed to the repository! Commit: ${commitUrl}`);
    } catch (error) {
        setFailed(`❌ Error updating README.md: ${error.message}`);
    }
}

export {
    updateReadme,
};
