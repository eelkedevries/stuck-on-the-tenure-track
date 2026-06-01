# Task: Add the turn screen

## Goal

Add the turn screen showing calendar, stage, and resources.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M13. Specification §5, §4.1, and §3. Depends on `054`, `020`, `021`.

## Required changes

1. Show the calendar, career stage, and resources for the current turn.

## Do not implement

Do not:
- implement the event screen (that is `056`);
- implement action allocation (that is `057`).

## Acceptance criteria

The task is complete when:
- the screen shows the current date, stage, and resources;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`055_turn_screen.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
