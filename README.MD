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
1. 📝 Committed to [TheDanniCraft/TheDanniCraft](https://github.com/TheDanniCraft/TheDanniCraft/commit/5fc27317944a0bca84ffde69e121b20579f20ddd)
2. 📝 Committed to [TheDanniCraft/TheDanniCraft](https://github.com/TheDanniCraft/TheDanniCraft/commit/e3b377ae1ab246218d75a56457eccfbbebfcb496)
3. 📝 Committed to [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log/commit/e39b470c005d4074f98994ee49d22794cb9e428d)
4. 📝 Committed to [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log/commit/4c630b62ba0ffd4fd798edbe47733416c915b89f)
5. 📦 Published release in [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log)
6. 📝 Committed to [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log/commit/d18708935d0587add8dbb0ae1936362aec59f4e2)
7. 📝 Committed to [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log/commit/1bc53502fdb142971583b495f3b0b9e12a78b7ff)
8. 📝 Committed to [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log/commit/aa249f7e4890d1c08ca7888f8483895a0d922c14)
9. 📝 Committed to [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log/commit/c2fee0700c403d78937ed5e33493c7bfb80a2d3f)
10. 🔔 Watching [TheDanniCraft/activity-log](https://github.com/TheDanniCraft/activity-log)
<!--END_SECTION:activity-->

## 📖Usage

- Create the section in your `README.MD` by adding a start `<!--START_SECTION:activity-->`  and end `<!--END_SECTION:activity-->`. You can find  an example [here](https://github.com/TheDanniCraft/activity-log/blob/aa249f7e4890d1c08ca7888f8483895a0d922c14/README.MD?plain=1#L20-L21).

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
        uses: TheDanniCraft/activity-log@v1.0.0
        with:
          GITHUB_USERNAME: "thedannicraft"
          GITHUB_TOKEN: ${{ secrets.TOKEN }}
```

Take a look at all possible [Inputs](#inputs) for customization

The above job runs every half an hour, you can change it as you wish based on the [cron syntax](https://crontab.guru).

Please note that only those public events that belong to the following list show up:

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
