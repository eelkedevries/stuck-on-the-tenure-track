# Task: Render the CV end screen

## Goal

Render the CV-formatted end screen.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M14. Specification §4.12 (end-game CV). Depends on `054`, `030`, `049`.

## Required changes

1. Render a psychology-CV-formatted end screen with publications, citations, h-index, grants, awards, teaching, service, and final placement.

## Do not implement

Do not:
- implement the costs list (that is `061`);
- implement PNG export (that is `062`).

## Acceptance criteria

The task is complete when:
- the end screen renders the CV sections from game state;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`060_cv_screen.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
