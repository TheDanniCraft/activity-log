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
1. ⭐ Starred [tandpfun/skill-icons](https://github.com/tandpfun/skill-icons)
2. 📝 Committed to [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log/commit/82a29a67caae5401f63fbfa2881b547a120922d0)
3. 📝 Committed to [TheDanniCraft/TheDanniCraft](https://github.com/TheDanniCraft/TheDanniCraft/commit/2d8c4c86ad40a8a4b36bc3efb4cf809a28a77bf3)
4. 📝 Committed to [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log/commit/8d08a705672161fecc9bcb1161cad02c0f31cabb)
5. 📝 Committed to [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log/commit/fa768ba9bcd8eb7b77f0bc3aa85127337fba4761)
6. 📝 Committed to [TheDanniCraft/TheDanniCraft](https://github.com/TheDanniCraft/TheDanniCraft/commit/c93f85be52d453b7d15762d546b01f82831ddd98)
7. 🚀 Published release [`v1.0.2`](https://github.com/TheDanniCraft/activity-log/releases/tag/v1.0.2) in [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log)
8. ➕ Created a new tag [`v1.0.2`](https://github.com/TheDanniCraft/activity-log/releases/tag/v1.0.2) in [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log)
9. 📝 Committed to [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log/commit/de1389ed933016c081bf18183df7c578563ed29f)
10. 📝 Committed to [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log/commit/68ef80852f64d9f9a7b658398c3bf4550492dd64)
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
- `GollumEvent`

You can find an example [here](https://github.com/TheDanniCraft/activity-log/blob/master/.github/workflows/update-activity.yml).

### Inputs

| **Input**         | **Description**                                                                                                                                                                 | **Required**     | **Default**                             | **Possible Options**                                                        |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|-----------------------------------------|-----------------------------------------------------------------------------|
| `GITHUB_USERNAME` | Your GitHub username.                                                                                                                                                           | ✅               | `-`                                     | A valid GitHub username                                                    |
| `GITHUB_TOKEN`    | Your GitHub token.                                                                                                                                                              | ✅               | `-`                                     | A valid GitHub access token (must belong to the specified GitHub username) |
| `EVENT_LIMIT`     | The maximum number of events to display.                                                                                                                                        | ❌               | `10`                                    | Any positive integer                                                       |
| `OUTPUT_STYLE`    | Specifies the format in which your output should be rendered. <br> <ins>Must be one of:</ins> <br> - `MARKDOWN`: Output in Markdown format <br> - `HTML`: Output in HTML format | ❌               | `MARKDOWN`                              | `MARKDOWN` or `HTML`                                                       |
| `IGNORE_EVENTS`   | The events to ignore, specified as a JSON array.                                                                                                                                | ❌               | `[]`                                    | JSON array of event types (e.g., `["PushEvent", "PullRequestEvent"]`)               |
| `README_PATH`     | The path to your README file.                                                                                                                                                   | ❌               | `README.md`                             | Any valid file path                                                        |
| `COMMIT_MESSAGE`  | Your commit message.                                                                                                                                                            | ❌               | `-`                                     | Any valid commit message                                                   |

## 📜License

[MIT](https://choosealicense.com/licenses/mit/)

## ✍️Authors

- [@thedannicraft](https://www.github.com/thedannicraft)
