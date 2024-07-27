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
1. 🚀 Created a new branch [`master`](https://github.com/TheDanniCraft/tag-bumper/tree/master) in [TheDanniCraft/tag-bumper](https://github.com/TheDanniCraft/tag-bumper)
2. 🚀 Created a new repository [TheDanniCraft/tag-bumper](https://github.com/TheDanniCraft/tag-bumper)
3. 🚀 Created a new tag [`v1`](https://github.com/TheDanniCraft/activity-log/releases/tag/v1) in [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log)
4. 🗑️ Deleted a tag `v1` in [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log)
5. 📦 Published release [`v1.0.1`](https://github.com/TheDanniCraft/activity-log/releases/tag/v1.0.1) in [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log)
6. 🚀 Created a new tag [`v1.0.1`](https://github.com/TheDanniCraft/activity-log/releases/tag/v1.0.1) in [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log)
7. 📝 Committed to [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log/commit/1f5a9730d9744cd81f957cac31d8864de3f9547e)
8. 📝 Committed to [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log/commit/95c154ad5d773cf09fc019a93212d184eb787a9e)
9. 🚀 Created a new tag [`v1.0.0`](https://github.com/TheDanniCraft/activity-log/releases/tag/v1.0.0) in [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log)
10. 📝 Committed to [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log/commit/b5c32c715fec2403c2357b9b3026276fbf182b35)
<!--END_SECTION:activity-->

## 📖Usage

- Create the section in your `README.MD` by adding a start `<!--START_SECTION:activity-->`  and end `<!--END_SECTION:activity-->`. You can find  an example [here](https://github.com/TheDanniCraft/activity-log/blob/aa249f7e4890d1c08ca7888f8483895a0d922c14/README.MD?plain=1#L20-L21).

- [Create a Personal Acces Token](https://github.com/settings/tokens) with `repo` scopes and add the token as [Repository  Secret](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions).

- Now create the workflow file.

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
          GITHUB_TOKEN: ${{ secrets.TOKEN }}
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
- `PullRequestEvent`
  - `opened`
  - `synchronize`
  - `closed`
  - `merged`
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
