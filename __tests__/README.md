# Testing Guide

This directory contains automated tests using Jest.

## Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode (re-runs on file changes)
bun test --watch

# Run tests with coverage report
bun test --coverage

# Run specific test file
bun test __tests__/unit/formatters.test.js

# Run tests matching a pattern
bun test --testNamePattern="formatEventsAsSVG"
```

## Test Structure

```
__tests__/
├── unit/
│   ├── config.test.js        # Configuration validation tests
│   ├── formatters.test.js    # Table and SVG formatter tests
│   └── file.test.js          # File operations tests (future)
└── integration/              # Integration tests (future)
    └── github.test.js        # GitHub API integration tests
```

### Unit Tests

- **`unit/config.test.js`** - Tests configuration validation:
  - OUTPUT_MODE validation (list, table, svg)
  - OUTPUT_STYLE validation (MARKDOWN, HTML)
  - Input processing and error handling

- **`unit/formatters.test.js`** - Tests event formatters:
  - `formatEventsAsTable()` - Markdown and HTML table generation
  - `formatEventsAsSVG()` - SVG generation with proper structure
  - Edge cases: empty events, missing data, long descriptions
  - XML escaping and layout calculations

## Writing Tests

Follow Jest best practices:

```javascript
describe('Feature Name', () => {
    // Setup runs before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Group related tests
    describe('specific function', () => {
        it('should do something expected', () => {
            // Arrange
            const input = 'test';
            
            // Act
            const result = myFunction(input);
            
            // Assert
            expect(result).toBe('expected');
        });

        it('should handle edge cases', () => {
            expect(myFunction(null)).toBe('default');
        });
    });
});
```

### Testing Guidelines

1. **Descriptive Names**: Use clear, descriptive test names
   - ✅ `it('should return empty SVG when no events provided')`
   - ❌ `it('test 1')`

2. **Group Tests**: Use `describe()` blocks to organize related tests

3. **Setup/Teardown**: Use `beforeEach()`/`afterEach()` for common setup
   ```javascript
   beforeEach(() => {
       jest.clearAllMocks();
   });
   ```

4. **Mock External Dependencies**: Use `jest.mock()` for external modules
   ```javascript
   jest.mock('@actions/core', () => ({
       getInput: jest.fn(),
       setFailed: jest.fn()
   }));
   ```

5. **Test Edge Cases**: Always test:
   - Empty inputs
   - Null/undefined values
   - Long strings
   - Invalid data types
   - Boundary conditions

6. **Single Assertion Focus**: Each test should verify one specific behavior

## Coverage

We aim for **>80% code coverage** on new code.

```bash
# Generate coverage report
bun test --coverage

# Coverage report is saved to coverage/ directory
# Open coverage/lcov-report/index.html in browser for detailed view
```

### Coverage Thresholds

Current configuration in `jest.config.js`:
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

## Mocking

### Mocking @actions/core

```javascript
const mockCore = {
    getInput: jest.fn(),
    setFailed: jest.fn(),
    notice: jest.fn()
};

jest.mock('@actions/core', () => mockCore);

// In your test
mockCore.getInput.mockReturnValue('test-value');
```

### Mocking File System

```javascript
jest.mock('fs/promises', () => ({
    readFile: jest.fn(),
    writeFile: jest.fn()
}));
```

## Debugging Tests

### Run Single Test
```bash
bun test --testNamePattern="should return empty SVG"
```

### Enable Verbose Output
```bash
bun test --verbose
```

### Use Console.log
Jest captures console output and shows it with failed tests:
```javascript
it('should do something', () => {
    console.log('Debug value:', myValue);
    expect(myValue).toBe(5);
});
```

## Common Issues

### Tests Not Found
- Ensure files end with `.test.js` or `.spec.js`
- Check `jest.config.js` testMatch patterns
- Files must be inside `__tests__/` directory

### Module Not Found
- Check relative import paths after moving files
- `require('../../src/utils/file')` - note the `../../` from `unit/` subdirectory

### Mock Not Working
- Call `jest.clearAllMocks()` in `beforeEach()`
- Ensure `jest.mock()` is at top level, not inside `describe()`

### Async Test Timeout
- Default timeout is 10000ms (10 seconds)
- Increase if needed: `jest.setTimeout(30000);`

## CI/CD Integration

Tests run automatically on:
- Every push to feature branches
- Every pull request
- Before merging to master

The CI pipeline uses the same `bun test` command.

## Adding New Tests

1. **Create test file** in appropriate subdirectory:
   ```bash
   touch __tests__/unit/newFeature.test.js
   ```

2. **Import module to test**:
   ```javascript
   const { myFunction } = require('../../src/utils/myModule');
   ```

3. **Write tests**:
   ```javascript
   describe('myFunction', () => {
       it('should work as expected', () => {
           expect(myFunction('input')).toBe('output');
       });
   });
   ```

4. **Run tests**:
   ```bash
   bun test __tests__/unit/newFeature.test.js
   ```

5. **Add to coverage**:
   - Coverage is automatically calculated for all files in `src/`

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Jest Matchers](https://jestjs.io/docs/expect)
- [Mocking with Jest](https://jestjs.io/docs/mock-functions)
- [Testing Best Practices](https://testingjavascript.com/)

---

**Happy Testing! 🧪**
