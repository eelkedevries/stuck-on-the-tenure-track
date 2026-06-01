# Task: Add the action allocation screen

## Goal

Add the action screen for allocating the time-point budget.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M13. Specification §5 and §4.2. Depends on `054`, `024`.

## Required changes

1. Let the player allocate the time-point budget across action categories and commit.

## Do not implement

Do not:
- implement resolution (already `025`);
- bind to locations beyond display (that is `050`).

## Acceptance criteria

The task is complete when:
- the allocation cannot exceed 100 time points and commits;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`057_action_allocation_screen.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
