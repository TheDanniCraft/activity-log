const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');
const { commitMessage, readmePath, token, dryRun, outputMode } = require('../config');
const { formatEventsAsTable, formatEventsAsSVG } = require('./eventDescriptions');

// Helper function for debug output logic
function logDebugActivity(activity) {
    if (process.env.ACT) {
        core.notice('🚧 Act-Debug mode enabled');
    } else if (dryRun) {
        core.notice('🚧 Dry run mode enabled');
    }

    if (process.env.ACT || dryRun) {
        console.log(activity);
    }
}

// Function to format activity based on output mode
function formatActivity(formattedString, rawEvents) {
    if (outputMode === 'table') {
        const { style } = require('../config');
        return formatEventsAsTable(rawEvents, style);
    }
    // Default: use the pre-formatted string (list mode)
    return formattedString;
}

// Function to update README.md and push changes
async function updateReadme(activityData) {
    try {
        const { formattedString, rawEvents } = activityData;
        const activity = formatActivity(formattedString, rawEvents);

        if (!activity || activity.trim().length === 0) {
            core.warning('⚠️ No activity to update. The README.md will not be changed.');
            return;
        }

        const readmeContent = fs.readFileSync(readmePath, 'utf-8');
        const startMarker = '<!--START_SECTION:activity-->';
        const endMarker = '<!--END_SECTION:activity-->';

        const startIdx = readmeContent.indexOf(startMarker);
        const endIdx = readmeContent.indexOf(endMarker);

        if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) {
            core.setFailed('❌ Section markers not found or invalid in README.md.');
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
            core.notice('📄 No changes in README.md, skipping...');
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

        // Use @actions/github to commit and push changes
        const octokit = github.getOctokit(token);
        const { owner, repo } = github.context.repo;
        const branch = github.context.ref.replace('refs/heads/', '');

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

        // Create a new tree with the updated README
        const { data: newTree } = await octokit.rest.git.createTree({
            owner,
            repo,
            base_tree: treeSha,
            tree: [{
                path: readmePath.replace(/^.*[\\\/]/, ''),
                mode: '100644',
                type: 'blob',
                content: updatedContent
            }]
        });

        core.notice('✅ README.md updated successfully!');

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
        core.notice(`✅ Changes pushed to the repository! Commit: ${commitUrl}`);
    } catch (error) {
        core.setFailed(`❌ Error updating README.md: ${error.message}`);
    }
}

// Function to write SVG file and push changes
async function writeSvgFile(activityData) {
    try {
        const { rawEvents } = activityData;

        if (!rawEvents || rawEvents.length === 0) {
            core.warning('⚠️ No activity to generate SVG. The file will not be created.');
            return;
        }

        // Generate SVG content
        const svgContent = formatEventsAsSVG(rawEvents);

        // Determine SVG file path (default to activity-log.svg in the repo root)
        const svgPath = 'activity-log.svg';

        // Read current SVG if it exists to check for changes
        let currentContent = '';
        try {
            currentContent = fs.readFileSync(svgPath, 'utf-8');
        } catch (error) {
            // File doesn't exist yet, that's fine
        }

        // Quick length check before expensive normalization
        if (currentContent.length === svgContent.length) {
            // Only normalize if lengths match (likely unchanged)
            const normalizedCurrent = currentContent.replace(/\s+/g, ' ').trim();
            const normalizedNew = svgContent.replace(/\s+/g, ' ').trim();

            if (normalizedCurrent === normalizedNew) {
                core.notice('📄 No changes in SVG file, skipping...');
                if (process.env.ACT || dryRun) {
                    logDebugActivity(svgContent);
                }
                return;
            }
        }

        // Log debug activity and skip update if ACT or dryRun is enabled
        if (process.env.ACT || dryRun) {
            logDebugActivity(svgContent);
            return;
        }

        // Use @actions/github to commit and push changes
        const octokit = github.getOctokit(token);
        const { owner, repo } = github.context.repo;
        const branch = github.context.ref.replace('refs/heads/', '');

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

        // Create a new tree with the updated SVG file
        const { data: newTree } = await octokit.rest.git.createTree({
            owner,
            repo,
            base_tree: treeSha,
            tree: [{
                path: svgPath,
                mode: '100644',
                type: 'blob',
                content: svgContent
            }]
        });

        core.notice(`✅ ${svgPath} generated successfully!`);

        // Create a new commit with the author set to github-actions[bot]
        const { data: newCommit } = await octokit.rest.git.createCommit({
            owner,
            repo,
            message: commitMessage || 'Update activity log SVG',
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
        core.notice(`✅ Changes pushed to the repository! Commit: ${commitUrl}`);
    } catch (error) {
        core.setFailed(`❌ Error writing SVG file: ${error.message}`);
    }
}

module.exports = {
    updateReadme,
    writeSvgFile,
};
