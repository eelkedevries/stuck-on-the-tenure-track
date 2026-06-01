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

## Canonical documents

- Binding specification: `docs-dev/reference/primary_authoritative/specification.md`
- Non-binding overview: `docs-dev/reference/secondary_background/overview.md`
- Living progress/state note: `docs-dev/planning/current_state.md`

## Imported planning-file mismatch

The original Drive `CLAUDE.md` source file recorded that a Svelte 5 + TypeScript + Vite framework layer had already been implemented and tested elsewhere. That claim is not true of this GitHub repository at the time of this import. Treat it as historical planning context, not as current repository state.

## Public repository note

This repository is public. Do not commit secrets, credentials, private planning notes, customer information, proprietary material, or anything unsuitable for public repository history.

## Recommended next prompt

Create `002_scaffold_svelte_vite.md` to add the initial Svelte 5 + TypeScript + Vite scaffold, update README run instructions, and verify that the development server starts. Do not implement gameplay in that prompt.
