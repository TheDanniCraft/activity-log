const { fetchAndFilterEvents } = require('./utils/github');
const { updateReadme, writeSvgFile } = require('./utils/file');
const { username, token, eventLimit, ignoreEvents, readmePath, commitMessage, outputMode } = require('./config');
const core = require('@actions/core')

// Main function to execute the update process
async function main() {
    try {
        core.info(`🔄 Fetching recent activity for ${username}...`);
        const activityData = await fetchAndFilterEvents({ username, token, eventLimit, ignoreEvents });

        if (!activityData.rawEvents || activityData.rawEvents.length === 0) {
            core.warning('⚠️ No events found to process.');
            return;
        }

        core.info(`📊 Processing ${activityData.rawEvents.length} events in '${outputMode}' mode...`);

        // Route to appropriate handler based on output mode
        if (outputMode === 'svg') {
            await writeSvgFile(activityData);
        } else {
            // list or table mode - both update README
            await updateReadme(activityData);
        }

        core.info('✅ Activity log updated successfully!');
    } catch (error) {
        core.setFailed(`❌ Error in the update process: ${error.message}`);
        console.error(error)
        process.exit(1);
    }
}

// Execute the main function
main();
