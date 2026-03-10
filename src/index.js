import { fetchAndFilterEvents } from './utils/github.js';
import { updateReadme } from './utils/file.js';
import { username, token, eventLimit, ignoreEvents, readmePath } from './config.js';
import { setFailed } from '@actions/core';

// Main function to execute the update process
async function main() {
    try {
        const activity = await fetchAndFilterEvents({ username, token, eventLimit, ignoreEvents });
        await updateReadme(activity, readmePath);
    } catch (error) {
        setFailed(`❌ Error in the update process: ${error.message}`);
        console.error(error)
        process.exit(1);
    }
}

// Execute the main function
main();
