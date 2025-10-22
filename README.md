<h1 align="center" id="title">Activity Log</h1>

![activity log](https://socialify.git.ci/TheDanniCraft/activity-log/image?forks=1&issues=1&language=1&logo=https%3A%2F%2Favatars.githubusercontent.com%2Fu%2F66677362&name=1&owner=1&pattern=Solid&pulls=1&stargazers=1&theme=Auto)

<p align="center">
    <img src="https://img.shields.io/badge/Made%20with%20Love%E2%9D%A4%EF%B8%8F-black?style=for-the-badge" alt="made with love">
    <img src="https://img.shields.io/badge/Node.JS-node?style=for-the-badge&amp;logo=nodedotjs&amp;logoColor=white&amp;color=%235FA04E" alt="nodejs">
    <img src="https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/TheDanniCraft/endpoints/refs/heads/master/badge/activity-log.json&style=for-the-badge" alt="Count of Action Users">
    <img src="https://www.codefactor.io/repository/github/thedannicraft/activity-log/badge?style=for-the-badge" alt="CodeFactor Grade">
    <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<a href="#contributors"><img src="https://img.shields.io/github/all-contributors/TheDanniCraft/activity-log?style=for-the-badge" alt="All Contributors"></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
</p>

A GitHub Action that automatically updates your README file with the latest activity from your GitHub account. Customize the displayed events, set a limit on the number of events, and ignore specific event types. Ideal for keeping your personal README file current with recent contributions and changes.

## 🛠️Features

- Customizable Event Limits
- Event Filtering
- Flexibility with Inputs
- Customizable
- Dry Run Mode (preview changes without committing)
- Custom Commit Messages
- Markdown or HTML Output Styles
- Multiple Output Modes (List, Table, SVG)
- Hide Details on Private Repositories

## ✍️ Example

<!--START_SECTION:activity-->
1. 🔎 Reviewed [PR #73](https://github.com/TheDanniCraft/activity-log/pull/73) in [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log)
2. 🗣 Commented on issue [#73](https://github.com/TheDanniCraft/activity-log/issues/73) in [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log): [View Comment](https://github.com/TheDanniCraft/activity-log/issues/73#issuecomment-3429831355)
3. 🗣 Commented on issue [#47](https://github.com/TheDanniCraft/activity-log/issues/47) in [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log): [View Comment](https://github.com/TheDanniCraft/activity-log/issues/47#issuecomment-3426870033)
4. 🚀 Committed to [TheDanniCraft/quickdrop](https://github.com/TheDanniCraft/quickdrop/commit/25d62bef3b81c2863581e18f79185a7189562413)
5. 🚀 Committed to [Wiresense/wiresense.js](https://github.com/Wiresense/wiresense.js/commit/77be897fc13727beccdde2799b917bdd3d33df09)
6. 🚀 Committed to [TheDanniCraft/swatch-studio](https://github.com/TheDanniCraft/swatch-studio/commit/3cad765b015ed7e1dd9f630ae5fbdcf7a2deb20c)
7. 🚀 Committed to [TheDanniCraft/clipify](https://github.com/TheDanniCraft/clipify/commit/e975cc10e8290e85d990d22c711aa0dd137e49ec)
8. 🚀 Committed to [TheDanniCraft/clipify](https://github.com/TheDanniCraft/clipify/commit/786b17d369463f791dd416a10a3eefc16497d05b)
9. ⭐ Starred [apteryxxyz/next-ws](https://github.com/apteryxxyz/next-ws)
10. 🏷️ Added a label to [PR #72](https://github.com/TheDanniCraft/activity-log/pull/72) in [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log)
<!--END_SECTION:activity-->

## 📖Usage

### 1. Add Sections to `README.md`

Include the following placeholders in your `README.md` where you want the activity log to appear:

```markdown
<!--START_SECTION:activity-->
<!--END_SECTION:activity-->
```

For a reference example, you can view this [sample `README.md`](https://github.com/TheDanniCraft/activity-log/blob/master/README.md?plain=1#L20-L31).

### 2. Create a Personal Access Token

<details open>
  <summary><strong>Quick Setup</strong> <i>(Recommended)</i></summary>

  1. To create a personal access token with the necessary permissions, click this [link to create a new token](https://github.com/settings/tokens/new?description=Github%20Activity%20Log%20(TheDanniCraft/activity-log)&scopes=repo). This link pre-fills the token description and scopes for your convenience.
  2. On the token creation page, review the pre-filled data and set the expiration date to "Never".
  3. Click "Generate token" and copy the token (be sure to save it as you won’t be able to see it again).

</details>

<details>
  <summary><strong>Manual Setup</strong></summary>

  1. Go to your GitHub [Personal Access Tokens settings](https://github.com/settings/tokens).
  2. Click on "Generate new token".
  3. Provide a descriptive name for the token, such as `Github Activity Log (TheDanniCraft/activity-log)`.
  4. Select the `repo` scope (recommended if you want private repo activity to show up).
  5. Set the expiration date to "Never".
  6. Click "Generate token" and copy the token (be sure to save it as you won’t be able to see it again).

</details>

### 3. Add the Token as a Repository Secret

1. Navigate to your GitHub repository.
2. Go to "Settings" > "Secrets and variables" > "Actions".
3. Click "New repository secret".
4. Name the secret (e.g., `TOKEN`).
5. Paste the personal access token into the value field.
6. Click "Add secret".

### 4. Create the Workflow File

Create a new file in your repository under `.github/workflows/`, for example, `activity-log.yml`. Add the following content to this file:

```yml
# .github/workflows/update-activity.yml:

name: Update GitHub Activity

on:
  schedule:
    - cron: "*/30 * * * *" # Runs every 30 minutes
  workflow_dispatch: # Allows manual triggering

jobs:
  update-activity:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Update GitHub Activity
        uses: TheDanniCraft/activity-log@v1
        with:
          GITHUB_USERNAME: "thedannicraft"
          GITHUB_TOKEN: ${{ secrets.TOKEN }} # Ensure this matches the secret name in repository settings
```

Take a look at all possible [Inputs](#inputs) for customization

The above job runs every half an hour, you can change it as you wish based on the [cron syntax](https://crontab.guru).

Please note that only those public events that belong to the following list show up:

- `CreateEvent`
- `PushEvent`
- `IssuesEvent`
  - `opened`
  - `edited`
  - `closed`
  - `reopened`
  - `assigned`
  - `unassigned`
  - `labeled`
  - `unlabeled`
- `PullRequestEvent`
  - `opened`
  - `edited`
  - `closed`
  - `merged`
  - `reopened`
  - `assigned`
  - `unassigned`
  - `review_requested`
  - `review_request_removed`
  - `labeled`
  - `unlabeled`
  - `synchronize`
- `ReleaseEvent`
- `ForkEvent`
- `CommitCommentEvent`
- `IssueCommentEvent`
- `PullRequestReviewEvent`
- `PullRequestReviewCommentEvent`
- `RepositoryEvent`
- `WatchEvent`
- `StarEvent`
- `PublicEvent`
- `GollumEvent`

You can find an example [here](https://github.com/TheDanniCraft/activity-log/blob/master/.github/workflows/update-activity.yml).

### Inputs

| **Input**                       | **Description**                                                                                                                                                                 | **Required**     | **Default**                             | **Possible Options**                                                        |
|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|-----------------------------------------|-----------------------------------------------------------------------------|
| `GITHUB_USERNAME`               | Your GitHub username.                                                                                                                                                           | ✅               | `-`                                     | A valid GitHub username                                                     |
| `GITHUB_TOKEN`                  | Your GitHub token.                                                                                                                                                              | ✅               | `-`                                     | A valid GitHub access token (must belong to the specified GitHub username)  |
| `EVENT_LIMIT`                   | The maximum number of events to display.                                                                                                                                        | ❌               | `10`                                    | Any positive integer (250 max.)                                             |
| `OUTPUT_STYLE`                  | Specifies the format in which your output should be rendered. <br> <ins>Must be one of:</ins> <br> - `MARKDOWN`: Output in Markdown format <br> - `HTML`: Output in HTML format | ❌               | `MARKDOWN`                              | `MARKDOWN` or `HTML`                                                        |
| `OUTPUT_MODE`                   | Specifies the output mode. <br> <ins>Must be one of:</ins> <br> - `list`: Ordered list format (default) <br> - `table`: Table with Date, Event, Repository, Description <br> - `svg`: Generate an SVG image file | ❌               | `list`                                  | `list`, `table`, or `svg`                                                   |
| `IGNORE_EVENTS`                 | The events to ignore, specified as a JSON array.                                                                                                                                | ❌               | `[]`                                    | JSON array of event types (e.g., `["PushEvent", "PullRequestEvent"]`)       |
| `HIDE_DETAILS_ON_PRIVATE_REPOS` | Hide details (branch/tag name) on private repositories                                                                                                                          | ❌               | `false`                                 | `true` or `false`                                                           |
| `README_PATH`                   | The path to your README file.                                                                                                                                                   | ❌               | `README.md`                             | Any valid file path                                                         |
| `COMMIT_MESSAGE`                | Commit message used when updating the README file.                                                                                                                              | ❌               | `Update README.md with latest activity`  | Any valid commit message                                                    |
| `EVENT_EMOJI_MAP`               | Optional YAML object mapping event types to emojis. (See [🎨 Customizing Emojis](https://github.com/TheDanniCraft/activity-log#-customizing-emojis))                            | ❌               | `""`                                    | YAML object mapping event types to emojis                                   |
| `DRY_RUN`                       | Enable dry run mode (no changes will be committed)                                                                                                                              | ❌               | `false`                                 | `true` or `false`                                                           |

## 📊 Output Modes

The `OUTPUT_MODE` input allows you to choose how your activity log is displayed. Three modes are available:

### 1. **List Mode** (Default)

Traditional numbered list format - perfect for inline README sections.

```yaml
uses: TheDanniCraft/activity-log@v1
with:
  GITHUB_USERNAME: "your-username"
  GITHUB_TOKEN: ${{ secrets.TOKEN }}
  OUTPUT_MODE: list  # Can be omitted since it's the default
```

**Example output:**
```
1. 📝 Committed to [repo-name](link)
2. ⭐ Starred [repo-name](link)
3. 🔀 Opened a pull request in [repo-name](link)
```

### 2. **Table Mode**

Displays activity in a structured table with columns for Date, Event, Repository, and Description.

```yaml
uses: TheDanniCraft/activity-log@v1
with:
  GITHUB_USERNAME: "your-username"
  GITHUB_TOKEN: ${{ secrets.TOKEN }}
  OUTPUT_MODE: table
```

**Example output:**

| Date | Event | Repository | Description |
|------|-------|------------|-------------|
| Oct 22, 2025 | Push | [repo-name](link) | 📝 Committed to [repo-name](link) |
| Oct 21, 2025 | Star | [repo-name](link) | ⭐ Starred [repo-name](link) |

### 3. **SVG Mode**

Generates a beautiful SVG image file with your activity log. Perfect for visual displays and avoiding commit noise.

```yaml
uses: TheDanniCraft/activity-log@v1
with:
  GITHUB_USERNAME: "your-username"
  GITHUB_TOKEN: ${{ secrets.TOKEN }}
  OUTPUT_MODE: svg
  COMMIT_MESSAGE: "Update activity-log.svg"
```

**Features:**
- 🎨 GitHub-styled card design with alternating row colors
- 📝 Selectable text (users can copy text from the SVG)
- 📐 Automatic height calculation based on number of events
- 🎯 Generated as `activity-log.svg` in your repository root

**Embed in your README:**
```markdown
![Activity Log](./activity-log.svg)
```

**Why use SVG mode?**
- ✅ Reduces commit noise (one file vs. README updates)
- ✅ Visually appealing with GitHub styling
- ✅ Can be used in a separate automation repository
- ✅ Text remains selectable and accessible

### 📋 Example Workflows

Complete workflow examples for each output mode are available in [`.github/workflows/examples/`](.github/workflows/examples/):

- **[test-list-mode.yml](.github/workflows/examples/test-list-mode.yml)** - List mode example
- **[test-table-mode.yml](.github/workflows/examples/test-table-mode.yml)** - Table mode example  
- **[test-svg-mode.yml](.github/workflows/examples/test-svg-mode.yml)** - SVG mode example

These examples show complete GitHub Actions workflow configurations you can copy and adapt for your own repository.

## 🎨 Customizing Emojis

You can personalize the emojis shown for each event type using the `EVENT_EMOJI_MAP` input. This input accepts a YAML object mapping event types (and subtypes) to your preferred emojis.

**Example usage in your workflow:**

```yaml
uses: TheDanniCraft/activity-log@v1
with:
  GITHUB_USERNAME: "thedannicraft"
  GITHUB_TOKEN: ${{ secrets.TOKEN }}
  EVENT_EMOJI_MAP: |
    PushEvent: "🚀"
    CreateEvent: "✨"
    DeleteEvent: "🔥"
    IssuesEvent: |
      opened: "🆕"
      closed: "✅"
```

Reference the `EVENT_EMOJI_MAP` input in the [Inputs](#inputs) table above for more details.

## 📜License

[MIT](https://choosealicense.com/licenses/mit/)

## ✍️Authors

- [@thedannicraft](https://www.github.com/thedannicraft)

## ✨Contributors 

Thanks goes to these wonderful people: [Emoji key for contribution types](https://allcontributors.org/docs/en/emoji-key).

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://leetcode.com/u/_theRJ_/"><img src="https://avatars.githubusercontent.com/u/97701228?v=4?s=100" width="100px;" alt="Rounak Joshi"/><br /><sub><b>Rounak Joshi</b></sub></a><br /><a href="https://github.com/TheDanniCraft/activity-log/commits?author=RounakJoshi09" title="Documentation">📖</a> <a href="https://github.com/TheDanniCraft/activity-log/commits?author=RounakJoshi09" title="Code">💻</a> <a href="https://github.com/TheDanniCraft/activity-log/commits?author=RounakJoshi09" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/gltched-usr"><img src="https://avatars.githubusercontent.com/u/126079750?v=4?s=100" width="100px;" alt="Glched"/><br /><sub><b>Glched</b></sub></a><br /><a href="https://github.com/TheDanniCraft/activity-log/issues?q=author%3Agltched-usr" title="Bug reports">🐛</a> <a href="https://github.com/TheDanniCraft/activity-log/commits?author=gltched-usr" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
