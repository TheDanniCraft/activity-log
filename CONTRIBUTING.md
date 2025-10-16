# Contributing Guidelines
*Pull requests, bug reports, and all other forms of contribution are welcomed and highly encouraged!* :octocat:

### Contents

- [Code of Conduct](#books-code-of-conduct)
- [Asking Questions](#bulb-asking-questions)
- [Opening an Issue](#inbox_tray-opening-an-issue)
- [Feature Requests](#love_letter-feature-requests)
- [Triaging Issues](#mag-triaging-issues)
- [Submitting Pull Requests](#repeat-submitting-pull-requests)
- [Usage of AI in Contributions](#robot-usage-of-ai-in-contributions)
- [Testing GitHub Actions Locally with nektos/act](#test_tube-testing-github-actions-locally-with-nektosact)
- [Writing Commit Messages](#memo-writing-commit-messages)
- [Code Review](#white_check_mark-code-review)
- [Coding Style](#nail_care-coding-style)
- [Certificate of Origin](#1st_place_medal-certificate-of-origin)
- [Credits](#pray-credits)

> **This guide serves to set clear expectations for everyone involved with the project so that we can improve it together while also creating a welcoming space for everyone to participate. Following these guidelines will help ensure a positive experience for contributors and maintainers.**

## :books: Code of Conduct

Please review our [Code of Conduct](https://github.com/TheDanniCraft/activity-log/blob/master/CODE_OF_CONDUCT.md). It is in effect at all times. We expect it to be honored by everyone who contributes to this project. Acting like an asshole will not be tolerated.

## :bulb: Asking Questions

See our [Support Guide](https://github.com/TheDanniCraft/activity-log/blob/master/SUPPORT.md). In short, GitHub issues are not the appropriate place to debug your specific project, but should be reserved for filing bugs and feature requests.

## :inbox_tray: Opening an Issue

Before [creating an issue](https://help.github.com/en/github/managing-your-work-on-github/creating-an-issue), check if you are using the latest version of the project. If you are not up-to-date, see if updating fixes your issue first.

### :lock: Reporting Security Issues

Review our [Security Policy](https://github.com/TheDanniCraft/activity-log/blob/master/SECURITY.md). **Do not** file a public issue for security vulnerabilities.

### :bug: Bug Reports and Other Issues

A great way to contribute to the project is to send a detailed issue when you encounter a problem. We always appreciate a well-written, thorough bug report. :+1:

In short, since you are most likely a developer, **provide an issue that you would like to receive**.

- **Review the documentation and [Support Guide](https://github.com/TheDanniCraft/activity-log/blob/master/SUPPORT.md)** before opening a new issue.
- **Do not open a duplicate issue!** Search through existing issues to see if your issue has previously been reported. If your issue exists, comment with any additional information you have. You may simply note "I have this problem too," which helps prioritize the most common problems and requests.
- **Prefer using [reactions](https://github.blog/2016-03-10-add-reactions-to-pull-requests-issues-and-comments/)**, not comments, if you simply want to "+1" an existing issue.
- **Fully complete the provided issue template.** The bug report template requests all the information we need to quickly and efficiently address your issue. Be clear, concise, and descriptive. Provide as much information as you can, including steps to reproduce, stack traces, compiler errors, library versions, OS versions, and screenshots (if applicable).
- **Use [GitHub-flavored Markdown](https://help.github.com/en/github/writing-on-github/basic-writing-and-formatting-syntax).** Especially put code blocks and console outputs in backticks (```). This improves readability.

## :love_letter: Feature Requests

Feature requests are welcome! While we will consider all requests, we cannot guarantee your request will be accepted. We want to avoid [feature creep](https://en.wikipedia.org/wiki/Feature_creep). Your idea may be great, but also out-of-scope for the project. If accepted, we cannot make any commitments regarding the timeline for implementation and release. However, you are welcome to submit a pull request to help!

- **Do not open a duplicate feature request.** Search for existing feature requests first. If you find your feature (or one very similar) previously requested, comment on that issue.
- **Fully complete the provided issue template.** The feature request template asks for all necessary information for us to begin a productive conversation.
- Be precise about the proposed outcome of the feature and how it relates to existing features. Include implementation details if possible.

## :mag: Triaging Issues

You can triage issues which may include reproducing bug reports or asking for additional information, such as version numbers or reproduction instructions. Any help you can provide to quickly resolve an issue is very much appreciated!

## :repeat: Submitting Pull Requests

We **love** pull requests! Before [forking the repo](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) and [creating a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/proposing-changes-to-your-work-with-pull-requests) for non-trivial changes, it is usually best to first open an issue to discuss the changes, or discuss your intended approach for solving the problem in the comments for an existing issue.

*Note: All contributions will be licensed under the project's license.*

- **Smaller is better.** Submit **one** pull request per bug fix or feature. A pull request should contain isolated changes pertaining to a single bug fix or feature implementation. **Do not** refactor or reformat code that is unrelated to your change. It is better to **submit many small pull requests** rather than a single large one. Enormous pull requests will take enormous amounts of time to review, or may be rejected altogether.
- **Coordinate bigger changes.** For large and non-trivial changes, open an issue to discuss a strategy with the maintainers. Otherwise, you risk doing a lot of work for nothing!
- **Prioritize understanding over cleverness.** Write code clearly and concisely. Remember that source code usually gets written once and read often. Ensure the code is clear to the reader. The purpose and logic should be obvious to a reasonably skilled developer; otherwise, you should add a comment that explains it.
- **Follow existing coding style and conventions.** Keep your code consistent with the style, formatting, and conventions in the rest of the codebase. When possible, these will be enforced with a linter. Consistency makes it easier to review and modify in the future.
- **Include test coverage.** Add unit tests or UI tests when possible. Follow existing patterns for implementing tests.
- **Update the example project** if one exists to exercise any new functionality you have added.
- **Add documentation.** Document your changes with code doc comments or in existing guides.
- **Use the repo's default branch.** Branch from and [submit your pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork) to the repo's default branch. Usually this is `main`, but it could be `dev`, `develop`, or `master`.
- **[Resolve any merge conflicts](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/resolving-a-merge-conflict-on-github)** that occur.
- **Promptly address any CI failures.** If your pull request fails to build or pass tests, please push another commit to fix it.
- When writing comments, use properly constructed sentences, including punctuation.

## :robot: Usage of AI in Contributions

We see AI as a tool to **speed up productivity**, **enhance creativity**, and **assist in repetitive tasks**, not to replace understanding or responsibility.  
Using AI to help write code, documentation, or tests is **welcome**, as long as it improves quality and is done responsibly.

AI may also be used to help **create issues**, such as bug reports or feature requests, as long as the **provided issue templates are fully followed** and the information is correct and relevant.  
However, using AI to generate or submit **security reports** (for example, through GitHub’s Security Advisory Program) is **not allowed**.

### ✅ Allowed if:
- The generated code or text is **thoroughly reviewed** by you before submission.  
- You **understand every line** of the code or documentation produced.  
- The pull request maintains or improves the overall **quality and consistency** of the project.  
- The AI-generated content is used to **accelerate or enhance development**, not to bypass effort.  
- You **disclose in the PR description** that AI was used, when applicable.

### ❌ Not allowed if:
- The PR or issue contains **low-quality, irrelevant, or untested content**.  
- The PR or issue is **spammy, bulk-generated**, or **created without review**.  
- You submit content that you **do not understand** or cannot explain.  
- The contribution **introduces security risks**, **plagiarism**, or **license violations**.  
- AI is used to **generate or submit security reports** through GitHub’s Security Advisory Program or other sensitive disclosure channels.

### ⚠️ Responsibility Notice

When using AI to generate part or all of your contribution, **you remain fully responsible** for what it produces.  
You must ensure all AI-assisted code or text meets the same standards as any manually written contribution.  
If you are unsure, seek a code review or open a draft PR to discuss it before submitting.

The maintainers **reserve the right to close pull requests or issues as invalid** if these rules are breached.  
In cases of repeated or severe violations, contributors **may be blocked from further participation** in the repository.  

Examples include, but are not limited to:
- Submitting several low-quality AI-generated pull requests or issues without review.  
- Using AI to generate copied or license-violating content.  
- Submitting a large PR that introduces critical bugs or breaks existing features without testing.  
- Attempting to bypass review or feedback by repeatedly opening new PRs with the same AI-generated code.

## :test_tube: Testing GitHub Actions Locally with nektos/act

You can run GitHub Actions workflows locally before submitting them in a pull request. The tool [`nektos/act`](https://github.com/nektos/act) simulates the execution of actions on your machine.

**Workflow Trigger:**
- The [`update-activity.yml`](.github/workflows/update-activity.yml) workflow uses both a schedule (`cron`) and [`workflow_dispatch`](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch).
- For local testing with `act`, use the `workflow_dispatch` trigger:
  ```
  act workflow_dispatch -W .github/workflows/update-activity.yml
  ```

**Recommended Extension:**
- For better local testing and debugging, use the VS Code extension [GitHub Local Actions](https://marketplace.visualstudio.com/items?itemName=SanjulaGanepola.github-local-actions).

**Notes:**
- Not all GitHub features are fully supported, but most workflows can be tested this way.
- If you encounter issues, check the output from `act` and adjust the configuration if necessary.

## :memo: Writing Commit Messages

**⚠️ Important:** This project uses **automated commit message validation** in CI/CD.  
All commit messages **must follow the Gitmoji + Conventional Commit format**, or pull requests will fail.

Writing clear commits helps maintain a readable history, improves collaboration, and enables automated tools like changelogs and release notes.

---

### 🧱 Commit Format

```
[gitmoji] [type](scope?): [Subject line in imperative form]

[Optional body explaining WHY the change was made]
```
_? = optional_

---

### 🗒 Rules for Commit Messages

1. **Start with a Gitmoji emoji**  
   Use an emoji that best represents the change  
   → Full list: https://gitmoji.dev

1. **Use Conventional Commit style**  
   `:emoji: type(scope?): subject`

   _Scope is optional. Use it only if it adds clarity (e.g. `🐛 fix(parser)`).  
   Multiple scopes can be separated with commas._

1. **Separate subject from body with a blank line**

1. **Limit the subject to 50 characters**  
   _(excluding the Gitmoji)_

1. **Capitalize the subject line**

1. **Do not end the subject with a period**

1. **Use imperative mood**  
   _Example: “Add login support” (✅), not “Added login support” (❌)_

1. **Wrap the body at ~72 characters**

1. **Use the body to explain WHY, not WHAT or HOW**  
   _Code already shows what was changed._

---

### ✅ Good Commit Example

```markdown
✨ feat: Add OAuth2 login support

Allow users to authenticate using Google and GitHub.
This improves onboarding and prepares the system for future SSO providers.
```

```markdown
✨ feat(auth): Add OAuth2 login support

Allow users to authenticate using Google and GitHub.
This improves onboarding and prepares the system for future SSO providers.
```

```markdown
✨ feat(auth,ui): Add OAuth2 login button and handler

Add a login button in the UI and implement the OAuth2 handler
for Google and GitHub. Includes basic error handling and tests.
```

```markdown
🐛 fix(auth): Handle expired refresh tokens

Detect expired refresh tokens and force re-authentication
to prevent silent failures during API calls.
```

```markdown
📝 docs(README): Document OAuth2 setup and env vars

Document required OAuth client IDs, secrets, and redirect
URIs for Google and GitHub in the README.
```

---

### ❌ Bad Commit Examples

```
Add login support                       # Missing emoji and type
✨ add login                            # Missing type
feat(auth): add login                   # Missing emoji
✨ feat auth: add login                 # Missing parentheses around scope
✨ add abc                              # Emoji + subject, missing type
✨ feat: add login.                     # Trailing period (do not end subject with a period)
✨ feat(auth) add login                 # Missing colon after scope
🐛 fix: added login                     # Use imperative mood — "added" is past tense
📚 docs: update readme                  # Subject should be capitalized ("Update README")
✨ feat(auth): This subject line is way too long and exceeds fifty characters  # Subject > 50 chars
✨feat(auth): Add login                 # Missing space after emoji
```

---

### 🎨 Common Gitmoji

| Emoji | Purpose |
|-------|---------|
| ✨ | New feature |
| 🐛 | Bug fix |
| 📝 | Documentation |
| ♻️ | Refactor (no behavior change) |
| ✅ | Tests |
| 🔥 | Remove code or files |
| 🚧 | Work in progress |

---

### 🔢 Supported Commit Types

| Type | Description |
|------|-------------|
| feat | New feature |
| fix | Bug fix |
| docs | Documentation only |
| refactor | Code cleanup |
| style | Formatting or style only |
| test | Tests |
| build | Build or dependencies |
| ci | CI configuration |
| perf | Performance changes |
| chore | Maintenance tasks |
| revert | Revert commit |

---

## :white_check_mark: Code Review

Your pull request will be reviewed by a maintainer before being merged. This is a chance for us to collaborate and improve your contribution. We will provide feedback on your pull request and suggest changes if necessary. The review process may take time, but we appreciate your patience.

## :nail_care: Coding Style

Please follow the existing coding style and conventions in the project. Consistent style makes it easier for others to read and maintain the code. If you see something inconsistent, consider fixing it in your pull request.

## :1st_place_medal: Certificate of Origin

By contributing to this project, you certify that you agree to the following:

```
By contributing to this project, I certify that:

- I own the rights to my contribution or have the permission of the owner to submit it.
- I have read and understood the project's license and Code of Conduct.
- I am making my contribution under the project's license.
```

## :pray: Credits

Thanks for contributing! Your contributions are what make this project successful. We look forward to working with you! :heart:
