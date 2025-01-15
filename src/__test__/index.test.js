const fs = require('fs');
const mock_action = require('./mock_action');
const core = require('@actions/core');
const github = require('@actions/github');

// Mock the action config
jest.mock('@actions/core', () => ({
    getInput: jest.fn((name) => {
        return mock_action.inputs[name] || null;
      }),
    setOutput: jest.fn(),
    setFailed: jest.fn(),
    warning: jest.fn((name)=>{ console.log("W-" + name);}),
    notice: jest.fn(
      //(name)=>{ console.log("n-" + name);}
    ),
    debug: jest.fn((name)=>{ console.log("D-" + name);})
  }));

const { updateReadme } = require('../utils/file');

// Mock context and getOctokit functions
jest.mock('@actions/github', () => ({
context: {
    "payload": {
      "action": "opened",
      "issue": {
        "number": 1,
        "title": "Example issue"
      }
    },
    "eventName": "issues",
    "sha": "abcd1234",
    "ref": "refs/heads/main",
    "workflow": "CI",
    "action": "actions/action-name",
    "actor": "octocat",
    "job": "build",
    "runNumber": 42,
    "runId": 12345678,
    "repo": {
      "owner": "octocat",
      "repo": "hello-world"
    },
    "serverUrl": "https://github.com",
    "apiUrl": "https://api.github.com",
    "graphqlUrl": "https://api.github.com/graphql"
  },
getOctokit: jest.fn(),
}));

jest.mock('fs', () => ({
    constants: {
        O_RDONLY: 0, // Mock the constant
    },
    openSync: jest.fn(),
    promises: {
      access: jest.fn(),
      // Add other fs.promises methods as needed
    },
    readFileSync: jest.fn(),
}));

describe('updateReadme', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        //jest.clearAllMocks();
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

    test('should handle error when reading README.md', async () => {
        const activity = 'New activity';
        fs.readFileSync.mockImplementation(() => {
            throw new Error('File read error');
        });

        await updateReadme(activity);

        expect(core.setFailed).toHaveBeenCalledWith('❌ Error updating README.md: File read error');
    });

    test('should handle error when updating README.md', async () => {
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
                    updateRef: jest.fn().mockImplementation(() => {
                        throw new Error('Git update error');
                    })
                }
            }
        });

        await updateReadme(activity);

        expect(core.setFailed).toHaveBeenCalledWith('❌ Error updating README.md: Git update error');
    });

    test('should handle error when creating commit', async () => {
        const activity = 'New activity';
        const readmeContent = '<!--START_SECTION:activity-->\nOld activity\n<!--END_SECTION:activity-->';
        fs.readFileSync.mockReturnValue(readmeContent);

        github.getOctokit.mockReturnValue({
            rest: {
                git: {
                    getRef: jest.fn().mockResolvedValue({ data: { object: { sha: 'lastCommitSha' } } }),
                    getCommit: jest.fn().mockResolvedValue({ data: { tree: { sha: 'treeSha' } } }),
                    createTree: jest.fn().mockResolvedValue({ data: { sha: 'newTreeSha' } }),
                    createCommit: jest.fn().mockImplementation(() => {
                        throw new Error('Commit creation error');
                    }),
                    updateRef: jest.fn().mockResolvedValue({})
                }
            }
        });

        await updateReadme(activity);

        expect(core.setFailed).toHaveBeenCalledWith('❌ Error updating README.md: Commit creation error');
    });

    test('should handle error when creating tree', async () => {
        const activity = 'New activity';
        const readmeContent = '<!--START_SECTION:activity-->\nOld activity\n<!--END_SECTION:activity-->';
        fs.readFileSync.mockReturnValue(readmeContent);

        github.getOctokit.mockReturnValue({
            rest: {
                git: {
                    getRef: jest.fn().mockResolvedValue({ data: { object: { sha: 'lastCommitSha' } } }),
                    getCommit: jest.fn().mockResolvedValue({ data: { tree: { sha: 'treeSha' } } }),
                    createTree: jest.fn().mockImplementation(() => {
                        throw new Error('Tree creation error');
                    }),
                    createCommit: jest.fn().mockResolvedValue({ data: { sha: 'newCommitSha' } }),
                    updateRef: jest.fn().mockResolvedValue({})
                }
            }
        });

        await updateReadme(activity);

        expect(core.setFailed).toHaveBeenCalledWith('❌ Error updating README.md: Tree creation error');
    });

    test('should handle error when getting commit', async () => {
        const activity = 'New activity';
        const readmeContent = '<!--START_SECTION:activity-->\nOld activity\n<!--END_SECTION:activity-->';
        fs.readFileSync.mockReturnValue(readmeContent);

        github.getOctokit.mockReturnValue({
            rest: {
                git: {
                    getRef: jest.fn().mockResolvedValue({ data: { object: { sha: 'lastCommitSha' } } }),
                    getCommit: jest.fn().mockImplementation(() => {
                        throw new Error('Get commit error');
                    }),
                    createTree: jest.fn().mockResolvedValue({ data: { sha: 'newTreeSha' } }),
                    createCommit: jest.fn().mockResolvedValue({ data: { sha: 'newCommitSha' } }),
                    updateRef: jest.fn().mockResolvedValue({})
                }
            }
        });

        await updateReadme(activity);

        expect(core.setFailed).toHaveBeenCalledWith('❌ Error updating README.md: Get commit error');
    });

    test('should handle error when getting ref', async () => {
        const activity = 'New activity';
        const readmeContent = '<!--START_SECTION:activity-->\nOld activity\n<!--END_SECTION:activity-->';
        fs.readFileSync.mockReturnValue(readmeContent);

        github.getOctokit.mockReturnValue({
            rest: {
                git: {
                    getRef: jest.fn().mockImplementation(() => {
                        throw new Error('Get ref error');
                    }),
                    getCommit: jest.fn().mockResolvedValue({ data: { tree: { sha: 'treeSha' } } }),
                    createTree: jest.fn().mockResolvedValue({ data: { sha: 'newTreeSha' } }),
                    createCommit: jest.fn().mockResolvedValue({ data: { sha: 'newCommitSha' } }),
                    updateRef: jest.fn().mockResolvedValue({})
                }
            }
        });

        await updateReadme(activity);

        expect(core.setFailed).toHaveBeenCalledWith('❌ Error updating README.md: Get ref error');
    });

    test('should log debug message in ACT mode', async () => {
        process.env.ACT = 'true';
        const activity = 'New activity';
        const readmeContent = '<!--START_SECTION:activity-->\nOld activity\n<!--END_SECTION:activity-->';
        fs.readFileSync.mockReturnValue(readmeContent);

        await updateReadme(activity);

        expect(core.debug).toHaveBeenCalledWith('🚧 Act-Debug mode enabled)');
        expect(core.notice).not.toHaveBeenCalled();
        delete process.env.ACT;
    });

    test('should not log debug message when in ACT mode', async () => {
        process.env.ACT = 'true';
        const activity = 'Old activity';
        const readmeContent = '<!--START_SECTION:activity-->\nOld activity\n<!--END_SECTION:activity-->';
        fs.readFileSync.mockReturnValue(readmeContent);

        await updateReadme(activity);

        expect(core.debug).toHaveBeenCalledWith('🚧 Act-Debug mode enabled)');
        expect(core.notice).toHaveBeenCalledWith("📄 No changes in README.md, skipping...");
    });

});
