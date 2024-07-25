const fs = require('fs');

async function updateReadme(activity, readmePath) {
    try {
        if (!activity || activity.trim().length === 0) {
            console.warn('⚠️ No activity to update. The README.md will not be changed.');
            return;
        }

        const readmeContent = fs.readFileSync(readmePath, 'utf-8');
        const startMarker = '<!--START_SECTION:activity-->';
        const endMarker = '<!--END_SECTION:activity-->';

        const startIdx = readmeContent.indexOf(startMarker);
        const endIdx = readmeContent.indexOf(endMarker);

        if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) {
            throw new Error('❌ Section markers not found or invalid in README.md.');
        }

        const updatedContent = [
            readmeContent.substring(0, startIdx + startMarker.length),
            '\n',
            activity,
            '\n',
            readmeContent.substring(endIdx)
        ].join('');

        fs.writeFileSync(readmePath, updatedContent, 'utf-8');
        console.log('✅ README.md updated successfully!');
    } catch (error) {
        console.error('❌ Error updating README.md:', error);
    }
}

module.exports = {
    updateReadme,
};
