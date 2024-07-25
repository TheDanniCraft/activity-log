const { fetchAndFilterEvents } = require('./utils/github');
const { updateReadme } = require('./utils/file');
const { username, token, eventLimit, ignoreEvents, readmePath } = require('../config');

// Main function to execute the update process
async function main() {
    try {
        const activity = await fetchAndFilterEvents({ username, token, eventLimit, ignoreEvents });
        await updateReadme(activity, readmePath);
    } catch (error) {
        console.error('❌ Error in the update process:', error);
    }
}

// Execute the main function
main();
