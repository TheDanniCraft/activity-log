const mockCore = {
    getInput: jest.fn(),
    setFailed: jest.fn(),
    notice: jest.fn()
};

jest.mock('@actions/core', () => mockCore);

describe('Config Module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('processOutputMode', () => {
        it('should accept valid output modes', () => {
            mockCore.getInput.mockImplementation((name) => {
                const inputs = {
                    'GITHUB_USERNAME': 'testuser',
                    'GITHUB_TOKEN': 'token123',
                    'README_PATH': 'README.md',
                    'OUTPUT_MODE': 'list',
                    'OUTPUT_STYLE': 'MARKDOWN',
                    'EVENT_LIMIT': '5',
                    'IGNORE_EVENTS': '[]',
                    'HIDE_DETAILS_ON_PRIVATE_REPOS': 'false',
                    'COMMIT_MESSAGE': 'test',
                    'EVENT_EMOJI_MAP': '',
                    'DRY_RUN': 'false'
                };
                return inputs[name] || '';
            });

            delete require.cache[require.resolve('../../src/config')];
            const config = require('../../src/config');
            expect(config.outputMode).toBe('list');
        });

        it('should accept table mode', () => {
            mockCore.getInput.mockImplementation((name) => {
                const inputs = {
                    'GITHUB_USERNAME': 'testuser',
                    'GITHUB_TOKEN': 'token123',
                    'OUTPUT_MODE': 'table',
                    'OUTPUT_STYLE': 'MARKDOWN',
                    'README_PATH': 'README.md',
                    'EVENT_LIMIT': '5',
                    'IGNORE_EVENTS': '[]',
                    'HIDE_DETAILS_ON_PRIVATE_REPOS': 'false',
                    'COMMIT_MESSAGE': 'test',
                    'EVENT_EMOJI_MAP': '',
                    'DRY_RUN': 'false'
                };
                return inputs[name] || '';
            });

            delete require.cache[require.resolve('../../src/config')];
            const config = require('../../src/config');
            expect(config.outputMode).toBe('table');
        });

        it('should accept svg mode', () => {
            mockCore.getInput.mockImplementation((name) => {
                const inputs = {
                    'GITHUB_USERNAME': 'testuser',
                    'GITHUB_TOKEN': 'token123',
                    'OUTPUT_MODE': 'svg',
                    'OUTPUT_STYLE': 'MARKDOWN',
                    'README_PATH': 'README.md',
                    'EVENT_LIMIT': '5',
                    'IGNORE_EVENTS': '[]',
                    'HIDE_DETAILS_ON_PRIVATE_REPOS': 'false',
                    'COMMIT_MESSAGE': 'test',
                    'EVENT_EMOJI_MAP': '',
                    'DRY_RUN': 'false'
                };
                return inputs[name] || '';
            });

            delete require.cache[require.resolve('../../src/config')];
            const config = require('../../src/config');
            expect(config.outputMode).toBe('svg');
        });
    });

    describe('processOutputStyle', () => {
        it('should accept MARKDOWN style', () => {
            mockCore.getInput.mockImplementation((name) => {
                const inputs = {
                    'GITHUB_USERNAME': 'testuser',
                    'GITHUB_TOKEN': 'token123',
                    'OUTPUT_MODE': 'list',
                    'OUTPUT_STYLE': 'MARKDOWN',
                    'README_PATH': 'README.md',
                    'EVENT_LIMIT': '5',
                    'IGNORE_EVENTS': '[]',
                    'HIDE_DETAILS_ON_PRIVATE_REPOS': 'false',
                    'COMMIT_MESSAGE': 'test',
                    'EVENT_EMOJI_MAP': '',
                    'DRY_RUN': 'false'
                };
                return inputs[name] || '';
            });

            delete require.cache[require.resolve('../../src/config')];
            const config = require('../../src/config');
            expect(config.style).toBe('MARKDOWN');
        });

        it('should accept HTML style', () => {
            mockCore.getInput.mockImplementation((name) => {
                const inputs = {
                    'GITHUB_USERNAME': 'testuser',
                    'GITHUB_TOKEN': 'token123',
                    'OUTPUT_MODE': 'list',
                    'OUTPUT_STYLE': 'HTML',
                    'README_PATH': 'README.md',
                    'EVENT_LIMIT': '5',
                    'IGNORE_EVENTS': '[]',
                    'HIDE_DETAILS_ON_PRIVATE_REPOS': 'false',
                    'COMMIT_MESSAGE': 'test',
                    'EVENT_EMOJI_MAP': '',
                    'DRY_RUN': 'false'
                };
                return inputs[name] || '';
            });

            delete require.cache[require.resolve('../../src/config')];
            const config = require('../../src/config');
            expect(config.style).toBe('HTML');
        });
    });
});
