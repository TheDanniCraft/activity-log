const fs = require('fs');
const { updateReadme } = require('../utils/file');
const core = require('@actions/core');
const github = require('@actions/github');

jest.mock('fs');
jest.mock('@actions/core');
jest.mock('@actions/github');

describe('updateReadme', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should update README.md with new activity', async () => {
        const activity = 'New activity';
        const readmeContent = '<!--START_SECTION:activity-->\nOld activity\n<!--END_SECTION:activity-->';
        fs.readFileSync.mockReturnValue(readmeContent);

        github.getOctokit.mockReturnValue({
            rest: {
                git: {
                    getRef: jest.fn().mockResolvedValue({ data: { object: { sha: 'lastCommitSha' } } }),
                    getCommit: jest.fn().mockResolvedValue({ data: { tree: { sha: 'treeSha' } } }),
                    createTree: jest.fn().mockResolvedValue({ data: { sha: 'newTreeSha' } }),
                    createCommit: jest.fn().mockResolvedValue({ data: { sha: 'newCommitSha' } }),
                    updateRef: jest.fn().mockResolvedValue({})
                }
            }
        });

        await updateReadme(activity);

        expect(fs.readFileSync).toHaveBeenCalledWith('README.md', 'utf-8');
        expect(github.getOctokit).toHaveBeenCalledWith(expect.any(String));
        expect(core.notice).toHaveBeenCalledWith('✅ README.md updated successfully!');
    });

    test('should not update README.md if activity is empty', async () => {
        const activity = '';
        await updateReadme(activity);
        expect(core.warning).toHaveBeenCalledWith('⚠️ No activity to update. The README.md will not be changed.');
    });

    test('should not update README.md if section markers are not found', async () => {
        const activity = 'New activity';
        const readmeContent = 'No markers here';
        fs.readFileSync.mockReturnValue(readmeContent);

        await updateReadme(activity);

        expect(core.setFailed).toHaveBeenCalledWith('❌ Section markers not found or invalid in README.md.');
    });

    test('should not update README.md if content has not changed', async () => {
        const activity = 'Old activity';
        const readmeContent = '<!--START_SECTION:activity-->\nOld activity\n<!--END_SECTION:activity-->';
        fs.readFileSync.mockReturnValue(readmeContent);

        await updateReadme(activity);

        expect(core.notice).toHaveBeenCalledWith('📄 No changes in README.md, skipping...');
    });
});
