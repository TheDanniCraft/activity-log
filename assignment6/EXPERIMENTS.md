# Assignment 6 collaboration experiments

This baseline is prepared by the PM. Actual experiment branches and Pull Requests must be authored by the invited classmates to demonstrate collaboration.

## Experiment 1: same line
Both classmates branch from the same updated default branch and edit only the single value `releaseMessage` in `experiments/e1/conflict.js` to different strings. Merge the first PR; the other should show a genuine conflict. Record GitHub's conflict view and resolve without deleting either intended feature.

## Experiment 2: same file, different lines
Both classmates branch from the same base and edit separate functions in `experiments/e2/settings.js`. Use squash & merge for one PR and explain the resulting history.

## Experiment 3: different files
Classmate A edits `experiments/e3/feature-a.js`; classmate B edits `experiments/e3/feature-b.js`. Use rebase & merge for PRs and compare to merge and squash histories.

## Fast-forward
Use a separate, unprotected demonstration branch with `git merge --ff-only`; don't bypass the protected default branch.

## Evidence to capture
- contributor username and PR link
- base and head commit SHA
- CI before and after resolution
- conflict markers and final resolution
- `git log --graph --oneline --decorate --all -20`
- screenshot of policy settings and blocked merge
- git rerere or git range-diff demonstration

Do not claim CI enforcement until the repository ruleset or branch protection is configured and verified.
