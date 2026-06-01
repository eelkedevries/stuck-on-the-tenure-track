# Task: Deploy to GitHub Pages

## Goal

Add the GitHub Pages deployment workflow that publishes only the build output.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M16. Specification §6 (deployment). Depends on `012`, `071`.

## Required changes

1. Add a workflow that builds and publishes only `dist/` to GitHub Pages using the project base path.
2. Ensure no secrets, development notes, prompt files, or source maps are published.

## Do not implement

Do not:
- publish `docs-dev/`;
- add a backend or runtime LLM (out of scope, §9).

## Acceptance criteria

The task is complete when:
- the workflow publishes only the build output;
- the public-build check passes in the workflow;
- the deployed base path is `/stuck-on-the-tenure-track/`.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`072_deploy_github_pages.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
