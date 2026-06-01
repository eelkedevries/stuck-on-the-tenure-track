# Task: Apply the ghost penalty

## Goal

Apply the ghost penalty for never appearing in visibility-relevant locations.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M12. Specification §4.11. Depends on `050`.

## Required changes

1. Penalise players who never appear in visibility-relevant social locations.

## Do not implement

Do not:
- implement reputation display;
- implement endings (that is `049`).

## Acceptance criteria

The task is complete when:
- never visiting visibility-relevant locations reduces standing;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`053_ghost_penalty.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
