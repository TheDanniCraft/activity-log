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

> [!WARNING]
> GitHub recently changed rate limits. See [Rate Limiting](#-rate-limiting) for more info.

## 📚 Project Docs

- [Contributing Guidelines](./CONTRIBUTING.md)
- [Security Policy](./SECURITY.md)
- [Support Guide](./SUPPORT.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)

## 🛠️Features

- Customizable Event Limits
- Event Filtering
- Flexibility with Inputs
- Customizable
- Dry Run Mode (preview changes without committing)
- Custom Commit Messages
- Markdown or HTML Output Styles
- Hide Details on Private Repositories

## ✍️ Example

<!--START_SECTION:activity-->
1. 🔥 Deleted a branch renovate/github-actions/daily-non-major in [TheDanniCraft/clipify](https://github.com/TheDanniCraft/clipify) on Oct 31, 2026
2. 🔥 Deleted a branch fix/newsletter-horizontal-verification in [TheDanniCraft/clipify](https://github.com/TheDanniCraft/clipify) on Oct 31, 2026
3. 🚀 Committed to fix/newsletter-horizontal-verification in [TheDanniCraft/clipify](https://github.com/TheDanniCraft/clipify/commit/24d9f922015a9813fb1fcd4b12c0998dc417aa64) on Oct 31, 2026
4. 🚀 Committed to fix/newsletter-horizontal-verification in [TheDanniCraft/clipify](https://github.com/TheDanniCraft/clipify/commit/566b959680d801a1ae48eeb270e310fbc5157916) on Oct 31, 2026
5. 🚀 Committed to fix/newsletter-horizontal-verification in [TheDanniCraft/clipify](https://github.com/TheDanniCraft/clipify/commit/81f826c8c733f427e71717740e1af25d558f4e22) on Oct 31, 2026
6. 🚀 Committed to fix/public-page-navigation in [TheDanniCraft/clipify](https://github.com/TheDanniCraft/clipify/commit/89d7b4c326876fe90b7115d76533ef615b48c1c1) on Oct 31, 2026
7. 🚀 Committed to fix/newsletter-horizontal-verification in [TheDanniCraft/clipify](https://github.com/TheDanniCraft/clipify/commit/b8b0eb70deb5b5b868144103347084faa09ebbc1) on Oct 31, 2026
8. 🚀 Committed to fix/grafana-guide-labels in [TheDanniCraft/clipify](https://github.com/TheDanniCraft/clipify/commit/af6e9dae54e1ddab6b7c65bd65ae27959541b576) on Oct 31, 2026
9. 🚀 Committed to fix/public-page-navigation in [TheDanniCraft/clipify](https://github.com/TheDanniCraft/clipify/commit/99adee023dd9d090fa66ad96598316e8817a637a) on Oct 31, 2026
10. 🚀 Committed to fix/public-page-navigation in [TheDanniCraft/clipify](https://github.com/TheDanniCraft/clipify/commit/60049a067595517708c228e6ecb5b9d7bc6f58db) on Oct 31, 2026
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
| `EVENT_LIMIT`                   | The maximum number of rows to display (after grouping, when enabled). See [Rate Limiting](#-rate-limiting).                                                                                                 | ❌               | `10`                                    | Any positive integer (250 max.)                                             |
| `OUTPUT_STYLE`                  | Specifies the format in which your output should be rendered. <br> <ins>Must be one of:</ins> <br> - `MARKDOWN`: Output in Markdown format <br> - `HTML`: Output in HTML format <br> - `SVG`: Standalone transparent SVG | ❌               | `MARKDOWN`                              | `MARKDOWN`, `HTML` or `SVG`                                                        |
| `IGNORE_EVENTS`                 | The events to ignore, specified as a JSON array.                                                                                                                                | ❌               | `[]`                                    | JSON array of event types (e.g., `["PushEvent", "PullRequestEvent"]`)       |
| `HIDE_DETAILS_ON_PRIVATE_REPOS` | Hide details (branch/tag name) on private repositories                                                                                                                          | ❌               | `false`                                 | `true` or `false`                                                           |
| `OUTPUT_MODE` | Layout: `list`, `table`, or `svg` (standalone image). | ❌ | `list` | `list`, `table`, `svg` |
| `OUTPUT_PATH` | Output file; takes precedence over `README_PATH`. | ❌ | `README.md` (`activity-log.svg` for SVG) | `.md` / `.markdown`, or `.svg` for SVG |
| `GROUP_EVENTS` | Combine repeated pushes to the same repository, branch, actor and visibility. | ❌ | `false` | `true`, `false` |
| `README_PATH`                   | Deprecated alias for `OUTPUT_PATH`.                                                                                                                                                   | ❌               | `README.md`                             | Any valid file path                                                         |
| `COMMIT_MESSAGE`                | Commit message used when updating the README file.                                                                                                                              | ❌               | `Update README.md with latest activity`  | Any valid commit message                                                    |
| `EVENT_EMOJI_MAP`               | Optional YAML object mapping event types to emojis. (See [🎨 Customizing Emojis](https://github.com/TheDanniCraft/activity-log#-customizing-emojis))                            | ❌               | `""`                                    | YAML object mapping event types to emojis                                   |
| `EVENT_TEMPLATE`                | Template used to render all events. Placeholders: `{emoji}`, `{event_type}`, `{action}`, `{subject}`, `{verb}`, `{repo}`, `{repo_url}`, `{date}`, `{number}`, `{url}`, `{ref}`, `{ref_type}`            | ❌              | `"{emoji} {action} {subject} {ref} {number} {verb} [{repo}]({url})"`                                    | Template string                                                             |
| `DRY_RUN`                       | Enable dry run mode (no changes will be committed)                                                                                                                              | ❌               | `false`                                 | `true` or `false`                                                           |

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

## 🎯 Custom Event Templates

You can customize event rendering with one global template using `EVENT_TEMPLATE`.

Supported placeholders:

- `{emoji}`: Event emoji from the default map or `EVENT_EMOJI_MAP` (example: `🚀`)
- `{event_type}`: Raw GitHub event type (example: `PushEvent`)
- `{action}`: Human-readable action text (example: `Committed`, `Opened`, `Merged`)
- `{subject}`: Event object for readable phrasing (example: `PR`, `issue`, `commit`, `release`)
- `{verb}`: Connector based on legacy phrasing (example: `to`, `in`, or empty)
- `{repo}`: Repository name (or `a private repository` for private events)
- `{repo_url}`: Repository URL (example: `https://github.com/TheDanniCraft/activity-log`)
- `{date}`: Formatted event date in UTC (example: `Mar 10, 2026`)
- `{number}`: Issue/PR number when available (example: `#110`)
- `{url}`: Link to the related resource (commit/comment/review/PR/issue/release when available, otherwise the repository URL for public events)
- `{ref}`: Branch/tag ref when available (example: `main`, `v1.2.0`)
- `{ref_type}`: Ref type for create/delete events (example: `branch`, `tag`, `repository`)

Example:

```yaml
EVENT_TEMPLATE: "{emoji} {action} {subject} {ref} {number} {verb} [{repo}]({url})"
```

## ⚠️ Rate Limiting

GitHub has API rate limits. They are documented here:

- [REST API rate limits](https://docs.github.com/rest/using-the-rest-api/rate-limits-for-the-rest-api)
- [Secondary rate limits](https://docs.github.com/rest/using-the-rest-api/rate-limits-for-the-rest-api#about-secondary-rate-limits)

This action respects these limits by design:

- It waits and retries using GitHub's `retry-after` values.
- It stands down/backs off when GitHub signals throttling.
- It may run longer in heavy cases instead of failing immediately.

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

## 📝 Blog Posts

<table>
  <tr>
    <td>
      <a href="https://thedannicraft.blog/how-to-automate-your-github-readme/">
        <img width="140px" src="https://n8n.thedannicraft.de/webhook/bb79c6e2-3bfb-44a3-a111-f983a4410487/grabPostImage/6878fdd7970ad800016c79c0">
      </a>
    </td>
    <td>
      <a href="https://thedannicraft.blog/how-to-automate-your-github-readme/">How to automate your GitHub README</a><br/>Oct 23, 2025 • by TheDanniCraft
    </td>
  </tr>
</table>

Wrote a blog post about activity-log? [Open an issue](https://github.com/TheDanniCraft/activity-log/issues/new) and share the article link.






### 🖼️ Output layouts and grouped activity

![SVG output preview](examples/activity-log.svg)

The default stays a Markdown list inside the existing activity section markers.
Set `OUTPUT_MODE: table` for Date, Event, Repository and Description columns;
`OUTPUT_STYLE: HTML` works with either list or table mode.

```yaml
with:
  GITHUB_USERNAME: your-username
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  OUTPUT_MODE: svg
  OUTPUT_PATH: images/activity-log.svg
  GROUP_EVENTS: 'true'
```

`OUTPUT_MODE: svg` (or `OUTPUT_STYLE: SVG`) generates a standalone transparent
image with selectable text, wrapping and light/dark text colors. No section
markers or existing SVG file are needed. SVG paths must end in `.svg`;
list/table paths must end in `.md` or `.markdown` and contain the usual markers.
`OUTPUT_PATH` overrides the deprecated `README_PATH` alias. If both are omitted,
the default is `README.md`, or `activity-log.svg` for SVG output.

Embed the generated image manually: `![Recent activity](./images/activity-log.svg)`.
For a separate automation repository, use its raw image URL in your profile README.
The action commits into the repository running the workflow, using its token and
branch. The image still receives commits there; the profile README stays unchanged.
Keep `.github/workflows/update-activity.yml` as the reference workflow and change
its inputs to select a layout. `DRY_RUN: 'true'` previews every layout without committing.

With `GROUP_EVENTS: 'true'`, repeated pushes are combined across the fetched
window (up to GitHub's last 300 events), including nonadjacent pushes. Groups keep
the newest event's position and commit link and append a count, for example
`📝 Committed to owner/repo (5×)`. Different branches, actors, repositories and
visibility remain separate. Other event types keep their individual subjects and
links. Ignored events and bot pushes are filtered before grouping; `EVENT_LIMIT`
is applied afterward, so repeated pushes do not consume all visible rows.

Custom templates can use `{count}` (1 for ungrouped events). If the template
omits it, a count suffix is added for grouped entries. Templates, custom emojis
and private-repository redaction apply consistently to every layout. Dates are UTC.

Run the offline regression suite with `bun run test`, then `bun run build`.
