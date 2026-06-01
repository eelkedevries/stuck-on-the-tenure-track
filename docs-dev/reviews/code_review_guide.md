# Code review guide

Use this guide after each prompt commit, or when manually reviewing a direct maintenance commit.

This project uses direct commits to `main`, so review happens after each commit rather than through a pull request.

## Review checklist

1. Confirm the commit scope matches the prompt or explicit user request.
2. Check that no unrelated systems, features, dependencies, or files were changed.
3. Confirm the reported checks were actually relevant for the change.
4. If source code exists, run or preview the observable behaviour described in the acceptance criteria.
5. Confirm `docs-dev/planning/current_state.md` was updated when the commit added a system, changed a key decision, or altered setup/deployment state.
6. For public-site changes, confirm that generated build output does not include `docs-dev/`, `AGENTS.md`, `CLAUDE.md`, `.env*`, prompt guides, or source maps.
7. For content changes, confirm they do not introduce private information, defamatory real-person/institution content, or unlicensed assets.

## When review finds a problem

Do not amend or force-push committed prompt work. Create a superseding prompt such as `004b_title_screen_fix.md`, or a revert prompt if the whole commit should be undone.

## Audits

Store completed written audits under `docs-dev/reviews/audits/`.
