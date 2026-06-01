# Task: Add the event screen

## Goal

Add the event screen for mandatory and optional events.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M13. Specification §5 and §4.2. Depends on `054`, `023`.

## Required changes

1. Present mandatory and optional events for the turn.

## Do not implement

Do not:
- implement action allocation (that is `057`);
- author event content (milestone M15).

## Acceptance criteria

The task is complete when:
- mandatory and optional events are shown and resolvable;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`056_event_screen.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
