# AGENTS.md

Repository-wide instructions for AI/code agents working on `TheDanniCraft/activity-log`.

## 1. Scope and Priority

- Applies to the full repository.
- Follow explicit maintainer/user instructions first.
- Use this document as default behavior when no direct instruction conflicts.

## 2. Repository Overview

- Project type: GitHub Action (Node.js, ESM).
- Action entrypoint: `dist/index.js` (configured in `action.yml`).
- Source code lives in `src/`.
- Build output (distributable) lives in `dist/`.
- Workflows live in `.github/workflows/`.

## 3. Key Files and Responsibilities

- `action.yml`: public action interface (inputs, defaults, runtime).
- `src/index.js`: main implementation logic.
- `src/utils/*`: helper functions for GitHub/API/file handling.
- `dist/index.js`: compiled bundle shipped to users.
- `README.md`: usage, inputs, examples.
- `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`: contributor policy docs.

## 4. Change Boundaries

- Keep PR changes narrowly scoped to one concern.
- Do not refactor unrelated areas in feature/bugfix tasks.
- Preserve existing documentation tone and structure unless asked otherwise.
- Avoid introducing new dependencies unless clearly justified.

## 5. Build and Validation

Use repository scripts from `package.json`:

- Build bundle: `bun run build`
- Watch mode: `bun run watch`
- Commit lint check (latest commit): `bun run lint:commit`

When code changes affect runtime behavior:

- Update `src/*` first.
- Rebuild `dist/index.js` so `action.yml` entrypoint stays accurate.
- Verify README/action input docs still match behavior.

## 6. Workflow/CI Rules

Existing workflows:

- `commitlint.yml`
- `commitlint-comment.yml`
- `pr-quality.yml`
- `update-activity.yml`
- `update-major-tag.yml`

For workflow changes:

- Keep permissions minimal (`contents: read/write` only when needed).
- Prefer explicit guard conditions for tag/release automation.
- Avoid behavior that can silently downgrade moving tags (major tag safety).

## 7. Documentation Rules

- Keep docs consistent with repository voice (including emoji-heavy style).
- Improve clarity without flattening tone into generic boilerplate.
- If policy text is changed, update related docs together where needed.
- Keep examples aligned with real workflow/action usage.

## 8. Branching Conventions

- Feature: `feat/<issue_id>-<short-kebab-title>`
- Bugfix: `bugfix/<issue_id>-<short-kebab-title>`
- Maintenance/QoL/docs: `chore/<short-kebab-title>`

## 9. Commit Message Format

```text
:gitmoji: type(scope?): Subject in imperative mood

Optional body explaining why.
```

Rules:

- One gitmoji at the start (prefer shortcode such as `:sparkles:`).
- Allowed `type` values:
  - `feat`, `fix`, `docs`, `refactor`, `style`, `test`, `build`, `ci`, `perf`, `chore`, `revert`
- Subject: imperative, capitalized, no trailing period, concise.
- Use body for rationale/impact, not a diff summary.

Gitmoji references:

- https://gitmoji.dev/
- https://gitmoji.dev/specification
- https://gitmoji.dev/api/gitmojis

## 10. Security Handling

- Never disclose vulnerabilities in public issues or PR discussion.
- Follow `SECURITY.md` reporting flow.
- Keep secret/token handling out of logs and committed files.

## 11. PR Expectations

- Link related issue(s) where applicable.
- Include docs updates for behavior/input changes.
- Keep changelist easy to review.
- Ensure CI/workflow behavior is deterministic and safe.
- PRs without the repository PR template (or with the template removed/unfilled) are not accepted.
