# Contributing Guidelines
*Pull requests, bug reports, and all other forms of contribution are welcomed and highly encouraged!* :octocat:

### Contents

- [Code of Conduct](#books-code-of-conduct)
- [Asking Questions](#bulb-asking-questions)
- [Opening an Issue](#inbox-tray-opening-an-issue)
- [Feature Requests](#love_letter-feature-requests)
- [Triaging Issues](#mag-triaging-issues)
- [Submitting Pull Requests](#repeat-submitting-pull-requests)
- [Writing Commit Messages](#memo-writing-commit-messages)
- [Using Gitmoji](#tada-using-gitmoji)
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

## :memo: Writing Commit Messages

Please [write a great commit message](https://chris.beams.io/posts/git-commit/).

1. Separate subject from body with a blank line
1. Limit the subject line to 50 characters
1. Capitalize the subject line
1. Do not end the subject line with a period
1. Use the imperative mood in the subject line (example: "Fix networking issue")
1. Wrap the body at about 72 characters
1. Use the body to explain **why**, *not what and how* (the code shows that!)
1. If applicable, prefix the title with the relevant component name and the corresponding [Gitmoji](https://gitmoji.dev). (examples: ":memo: Fix typo", ":sparkles: Add user authentication")

```
🎉 Short summary of changes in 50 chars or less

Add a more detailed explanation here, if necessary. Possibly give 
some background about the issue being fixed, etc. The body of the 
commit message can be several paragraphs. Further paragraphs come 
after blank lines and please do proper word-wrap.

Wrap it to about 72 characters or so. In some contexts, 
the first line is treated as the subject of the commit and the 
rest of the text as the body. The blank line separating the summary 
from the body is critical (unless you omit the body entirely); 
various tools like `log`, `shortlog` and `rebase` can get confused 
if you run the two together.

Explain the problem that this commit is solving. Focus on why the 
change is being made, not how. Keep it simple. In case you need to 
explain something, use more paragraphs.
```

## :tada: Using Gitmoji

This project follows the Gitmoji standard. When writing commit messages, please use the [Gitmoji](https://gitmoji.dev) standard. Here is a short reference of the most commonly used emojis:

| Emoji | Description                                           |
|-------|-------------------------------------------------------|
| :sparkles: | Introduce new features                                |
| :bug: | Fix bugs                                             |
| :books: | Documentation updates                                 |
| :wrench: | Refactor code                                        |
| :white_check_mark: | Add tests                                            |
| :fire: | Remove code or files                                  |
| :zap: | Improve performance                                   |
| :tada: | Initial commit                                       |
| :wastebasket: | Remove code or files                                  |
| :construction: | Work in progress                                      |

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
