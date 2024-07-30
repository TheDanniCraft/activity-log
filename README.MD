<h1 align="center" id="title">Activity Log</h1>

![activity log](https://socialify.git.ci/TheDanniCraft/activity-log/image?forks=1&issues=1&language=1&logo=https%3A%2F%2Favatars.githubusercontent.com%2Fu%2F66677362&name=1&owner=1&pattern=Solid&pulls=1&stargazers=1&theme=Auto)

<p align="center">
    <img src="https://img.shields.io/badge/Made%20with%20Love%E2%9D%A4%EF%B8%8F-black?style=for-the-badge" alt="made with love">
    <img src="https://img.shields.io/badge/Node:JS-node?style=for-the-badge&amp;logo=nodedotjs&amp;logoColor=white&amp;color=%235FA04E" alt="typescript">
</p>

A GitHub Action that automatically updates your README file with the latest activity from your GitHub account. Customize the displayed events, set a limit on the number of events, and ignore specific event types. Ideal for keeping your personal README file current with recent contributions and changes.

## 🛠️Features

- Customizable Event Limits
- Event Filtering
- Flexibility with Inputs

## ✍️ Example

<!--START_SECTION:activity-->
1. ❌ Closed [PR #1](https://github.com/TheDanniCraft/tag-bumper/pull/1) in [TheDanniCraft/tag-bumper](https://github.com/TheDanniCraft/tag-bumper)
2. ❌ Closed [PR #49](https://github.com/TheDanniCraft/Portfolio/pull/49) in [TheDanniCraft/Portfolio](https://github.com/TheDanniCraft/Portfolio)
3. ❌ Closed [PR #26](https://github.com/Wiresense/frontend/pull/26) in [Wiresense/frontend](https://github.com/Wiresense/frontend)
4. 🔎 Reviewed [PR #26](https://github.com/Wiresense/frontend/pull/26) in [Wiresense/frontend](https://github.com/Wiresense/frontend)
5. ❌ Closed [PR #10](https://github.com/Wiresense/wiresense.js/pull/10) in [Wiresense/wiresense.js](https://github.com/Wiresense/wiresense.js)
6. 🔎 Reviewed [PR #10](https://github.com/Wiresense/wiresense.js/pull/10) in [Wiresense/wiresense.js](https://github.com/Wiresense/wiresense.js)
7. 📝 Committed to [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log/commit/2efa2ac0d2f693f05456e5f3b14c1bbc8cc21f1a)
8. 📝 Committed to [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log/commit/fd76c8a81b20e28e87d2b9d4d0f3060c419e6ea7)
9. 📝 Committed to [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log/commit/598f06dcb9ea316de88955537787f3e9fe75d66b)
10. ⭐ Starred [drawdb-io/drawdb](https://github.com/drawdb-io/drawdb)
<!--END_SECTION:activity-->

## 📖Usage

### 1. Add Sections to `README.md`

Include the following placeholders in your `README.md` where you want the activity log to appear:

```markdown
<!--START_SECTION:activity-->
<!--END_SECTION:activity-->
```

For a reference example, you can view this [sample `README.md`](https://github.com/TheDanniCraft/activity-log/blob/fd76c8a81b20e28e87d2b9d4d0f3060c419e6ea7/README.MD?plain=1#L20-L21).

### 2. Create a Personal Access Token

1. Go to your GitHub [Personal Access Tokens settings](https://github.com/settings/tokens).
2. Click on "Generate new token".
3. Provide a descriptive name for the token.
4. Select the `repo` scope (recommended if you want private repo activity to show up).
5. Click "Generate token" and copy the token (be sure to save it as you won’t be able to see it again).

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
- `SponsorshipEvent`

You can find an example [here](https://github.com/TheDanniCraft/activity-log/blob/master/.github/workflows/update-activity.yml).

### Inputs

| **Input**         | **Description**                                              | **Required** | **Default**                             |
|-------------------|--------------------------------------------------------------|--------------|-----------------------------------------|
| `GITHUB_USERNAME` | The GitHub username.                                         | Yes          | `-`                                     |
| `GITHUB_TOKEN`    | The GitHub token.                                            | Yes          | `-`                                     |
| `EVENT_LIMIT`     | The maximum number of events to display.                     | No           | `10`                                    |
| `IGNORE_EVENTS`   | The events to ignore, specified as a JSON array.             | No           | `[]`                                    |
| `README_PATH`     | The path to the README file.                                 | No           | `README.MD`                             |
| `COMMIT_MESSAGE`  | Commit Message                                               | No           | `Update README.md with latest activity` |

## 📜License

[MIT](https://choosealicense.com/licenses/mit/)

## ✍️Authors

- [@thedannicraft](https://www.github.com/thedannicraft)
