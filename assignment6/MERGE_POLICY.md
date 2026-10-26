# Assignment 6 — PM Merge Policy

## Rules
1. No direct pushes to protected default branch. Changes enter through PRs.
2. Require successful `A6 Required CI Gate`, `Commitlint`, and `Dist Build Check`.
3. Ask another teammate to review non-trivial code before approval.
4. Re-run required checks when the PR branch becomes stale.
5. Document conflict resolutions, links to original PRs, and release impact.

## Recommended merge style
- **Squash & Merge** for small, noisy feature branches: one meaningful commit per PR; easy single-commit revert, but loses intermediate commits useful for bisection.
- **Merge Commit** for multi-author features and conflicts when original branch topology is an important audit record. Preserves ancestry and individual commits; reverting a merge can require `git revert -m` and careful parent selection.
- **Rebase & Merge** for well-tested, logically separated commits where linear history improves bisectability. Rewrites commit IDs and can complicate traceability and reverting a coordinated set of commits.
- **Fast-forward** only on the isolated demo branch where the base has not diverged. Never bypass the default branch PR policy to produce the demonstration.

## CI gate and incident response
A failed test, lint or commit policy check blocks merge. The contributor corrects the error in the same PR and captures both failing and successful runs. PM verifies checks, approvals, and whether `master`/ `main` moved before merging.

## Conflict handling
Reproduce hard conflict from two independent branches changing the same exact line; merge the first PR only after CI success. In the second PR, fetch latest protected base locally, resolve conflict preserving both requirements, run tests, and push the resolved change. Record the exact markers and final snippet.

## Advanced Git evidence
`git config rerere.enabled true` records the resolution locally; recreate an equivalent conflict to demonstrate recorded reuse. Alternatively `git range-diff <old-base>..<old-tip> <new-base>..<new-tip>` compares rebase versions. Include actual terminal output, not illustrative text, in final evidence.
