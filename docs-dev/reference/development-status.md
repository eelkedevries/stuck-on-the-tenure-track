# Development status

Last updated: 2026-06-01.

## Current GitHub repository state

The GitHub repository has been initialised with documentation and agent-workflow files only. No application source code, Svelte/Vite scaffold, content loader, turn engine, tests, or deployment workflow has been imported or implemented in this repository yet.

## Imported planning-file mismatch

The Drive `CLAUDE.md` source file recorded that a Svelte 5 + TypeScript + Vite framework layer had already been implemented and tested elsewhere. That claim is not true of this GitHub repository at the time of this import. Treat it as historical planning context, not as current repository state.

## Active workflow decision

The old direct-to-`main` workflow has been replaced with the `eek-a-dev` prompt-based workflow:

- one numbered prompt per unit of work;
- one branch per prompt;
- one successful commit per prompt;
- human review/merge before `main` changes.

## Public repository note

This repository is public. Development-facing material is placed under `docs-dev/`, not `docs-local/`, because it is visible in public repository history. Do not commit secrets or private material.

## Recommended next prompt

`002_scaffold_svelte_vite.md`: create the initial Svelte 5 + TypeScript + Vite scaffold, update README run instructions, and verify that the development server starts. Do not implement gameplay in that prompt.
