# Development status

Last updated: 2026-06-01.

## Current GitHub repository state

The GitHub repository has been initialised with documentation and agent-instruction files only. No application source code, Svelte/Vite scaffold, content loader, turn engine, tests, or deployment workflow has been imported or implemented in this repository yet.

## Imported planning-file mismatch

The original Drive `CLAUDE.md` source file recorded that a Svelte 5 + TypeScript + Vite framework layer had already been implemented and tested elsewhere. That claim is not true of this GitHub repository at the time of this import. Treat it as historical planning context, not as current repository state.

## Active workflow decision

This repository uses direct commits to `main`:

- work is committed directly to `main`;
- no feature branches unless explicitly requested;
- no pull requests unless explicitly requested;
- each completed change should be checked, committed, and pushed.

## Filename consistency

The canonical reference filenames are:

- `specification.md`
- `stuck-on-the-tenure-track-overview.md`

Do not use `stuck-on-the-tenure-track-llm-reference.md` or `overview.md` as canonical repository references.

## Public repository note

This repository is public. Do not commit secrets, credentials, private planning notes, customer information, proprietary material, or anything unsuitable for public repository history.

## Recommended next step

Create the initial Svelte 5 + TypeScript + Vite scaffold, update README run instructions, and verify that the development server starts. Do not implement gameplay in that step.
