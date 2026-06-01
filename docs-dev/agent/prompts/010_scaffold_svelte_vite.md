# Task: Scaffold the Svelte + Vite app

## Goal

Add the initial Svelte 5 + TypeScript + Vite scaffold configured for the project base path, with a working verify command and a dev server that starts.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap milestone M0. Specification §1.3 (stack: Svelte 5 + TypeScript + Vite) and §5 (platform and performance targets). No prior build prompts.

## Required changes

1. Initialise a Svelte 5 + TypeScript + Vite project at the repository root.
2. Set the Vite base path to `/stuck-on-the-tenure-track/`.
3. Add an `npm run check` script that type-checks and builds.
4. Update `README.md` with install and run instructions using the committed lockfile (`npm ci`).

## Do not implement

Do not:
- implement any game systems, content, or UI screens;
- add CI or deployment workflows;
- add tests.

## Acceptance criteria

The task is complete when:
- `npm install` then `npm run check` succeeds;
- `npm run dev` serves a default page;
- `npm run build` emits `dist/` with the configured base path.

## Checks

Run `npm run check` and `npm run build`, then run `npm run dev` and confirm the page serves.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`010_scaffold_svelte_vite.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
