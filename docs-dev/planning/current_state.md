# Current state

Last updated: 2026-06-01.

## Repository state

The repository has been initialised with documentation, agent workflow guides, prompt scaffolding, helper scripts, and reference documents. No application source code, Svelte/Vite scaffold, content loader, turn engine, tests, or deployment workflow has been implemented yet.

## Active workflow

The repository follows the `eek-a-dev` commit-to-`main` workflow:

- one prompt equals one reviewable unit of work;
- prompt files live in `docs-dev/agent/prompts/`;
- prompt work is committed directly to `main` with the exact prompt filename as the commit message;
- no feature branches or pull requests unless explicitly requested;
- non-prompt commits use a conventional prefix such as `docs:`, `fix:`, or `feat:`.

Small explicit documentation or workflow-maintenance requests may be implemented directly. Product and code changes should normally be captured as numbered prompt files before execution.

## Canonical documents

- Binding specification: `docs-dev/reference/primary_authoritative/specification.md`
- Non-binding overview: `docs-dev/reference/secondary_background/overview.md`
- Living progress/state note: `docs-dev/planning/current_state.md`

## Documentation corrections completed

- `docs-dev/reference/primary_authoritative/specification.md` now has explicit `Version` and `Last updated` metadata.
- The specification now treats a turn as an abstract career turn with variable calendar duration, resolving the earlier conflict between a three-month turn and the approximately 18-year/25-turn structure.
- `docs-dev/agent/reviews/code_review_guide.md` has been added to make the review-guide reference valid.
- `docs-dev/agent/how_to_use.md` now describes CI as future/conditional rather than already present.
- `README.md` now notes optional pre-commit hook installation and the current no-licence/all-rights-reserved status.

## Imported planning-file mismatch

The original Drive `CLAUDE.md` source file recorded that a Svelte 5 + TypeScript + Vite framework layer had already been implemented and tested elsewhere. That claim is not true of this GitHub repository at the time of this import. Treat it as historical planning context, not as current repository state.

## Public repository note

This repository is public. Do not commit secrets, credentials, private planning notes, customer information, proprietary material, or anything unsuitable for public repository history.

## Recommended next prompt

Create `003_scaffold_svelte_vite.md` to add the initial Svelte 5 + TypeScript + Vite scaffold, update README run instructions, and verify that the development server starts. Do not implement gameplay in that prompt.
