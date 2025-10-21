# Testing Guide for Activity Log Output Modes

This guide will help you test the three output modes: **list**, **table**, and **svg**.

## Prerequisites

- ✅ Bun installed (`bun --version` should work)
- ✅ Dependencies installed (`bun install`)
- ✅ Project built (`bun run build`)
- ✅ GitHub token with appropriate permissions

## Method 1: Local Testing with Node.js

You can test the functionality locally without running GitHub Actions.

### Setup

1. **Set your GitHub token** (required for API access):
   ```bash
   export GITHUB_TOKEN="your_github_token_here"
   ```

2. **Set your GitHub username** (optional, defaults to 'pizofreude'):
   ```bash
   export GITHUB_USERNAME="your_username"
   ```

### Test Each Mode

**Test List Mode (default):**
```bash
node test-local.js list
```

**Test Table Mode:**
```bash
node test-local.js table
```

**Test SVG Mode:**
```bash
node test-local.js svg
```

### What to Look For

- **List Mode**: Should display numbered list in terminal (dry run mode)
- **Table Mode**: Should display markdown table with columns: Date | Event | Repository | Description
- **SVG Mode**: Should show SVG XML content in terminal (dry run mode)
- All modes should show "Dry run mode enabled" message
- No actual files should be modified (dry run)

## Method 2: GitHub Actions Local Testing (with nektos/act)

If you have `act` installed, you can test the GitHub Actions workflows locally.

### Install act (if not already installed)

**Windows (with Chocolatey):**
```bash
choco install act-cli
```

**Or download from:** https://github.com/nektos/act/releases

### Run Workflow Tests

**Test List Mode:**
```bash
act workflow_dispatch -W .github/workflows/test-list-mode.yml -s GITHUB_TOKEN="your_token"
```

**Test Table Mode:**
```bash
act workflow_dispatch -W .github/workflows/test-table-mode.yml -s GITHUB_TOKEN="your_token"
```

**Test SVG Mode:**
```bash
act workflow_dispatch -W .github/workflows/test-svg-mode.yml -s GITHUB_TOKEN="your_token"
```

## Method 3: GitHub Actions Extension in VS Code

You have the GitHub Actions extension installed, so you can test directly in VS Code:

1. **Open the GitHub Actions view** (Activity Bar → GitHub Actions icon)
2. **Find the test workflows**:
   - Test List Mode (Default)
   - Test Table Mode
   - Test SVG Mode
3. **Right-click on a workflow** → "Run Workflow"
4. **Check the output** in the Actions view

## Expected Results

### List Mode Output (Dry Run)
```
1. 📝 Committed to [repo-name](link)
2. 🎉 Created a new branch `branch-name` in [repo-name](link)
3. ⭐ Starred [repo-name](link)
...
```

### Table Mode Output (Dry Run)
```
| Date | Event | Repository | Description |
|------|-------|------------|-------------|
| Oct 22, 2025 | Push | [repo-name](link) | 📝 Committed to [repo-name](link) |
| Oct 21, 2025 | Create | [repo-name](link) | 🎉 Created a new branch... |
...
```

### SVG Mode Output (Dry Run)
Should generate an SVG file structure with:
- Header: "⚡ Recent Activity"
- Activity rows with dates and descriptions
- GitHub-styled design
- Selectable text

## Troubleshooting

### "401 Unauthorized" or API errors
- Check that your `GITHUB_TOKEN` is valid
- Ensure the token has `repo` and `user` permissions

### "Module not found" errors
- Run `bun install` to install dependencies
- Ensure you're in the project root directory

### Output not showing
- Check that `DRY_RUN` is set to `true` in test workflows
- Look for console output or error messages
- Verify the action is using the local build (`uses: ./`)

### SVG not rendering
- SVG output in dry run mode will be XML text
- To see the actual SVG, set `DRY_RUN: false` and check the generated file
- Open the `.svg` file in a browser to view it

## Testing Without Dry Run

To test actual file modifications:

1. **Create a test branch:**
   ```bash
   git checkout -b test-output-modes
   ```

2. **Modify workflow file** (e.g., `test-list-mode.yml`):
   ```yaml
   DRY_RUN: false
   ```

3. **Run the workflow** and check the changes:
   ```bash
   git status
   git diff
   ```

4. **Clean up:**
   ```bash
   git checkout .
   git checkout feature/issue-56/create-new-output-mode
   git branch -D test-output-modes
   ```

## Next Steps After Testing

Once testing is complete:
1. ✅ Verify all three modes work correctly
2. ✅ Document findings
3. ✅ Update main README.md with usage examples
4. ✅ Create pull request with test results
5. ✅ Include screenshots/examples of each output mode

---

**Happy Testing! 🚀**
