# Task: Implement the resolution phase

## Goal

Implement the resolution phase that applies outcomes and checks end triggers.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M3. Specification §4.2 (resolution phase). Depends on `023`, `024`.

## Required changes

1. Apply action outcomes, update state, and check milestones and game-end triggers in the resolution phase.

## Do not implement

Do not:
- implement individual systems' deep logic beyond applying their effects;
- implement rivals (that is `046`).

## Acceptance criteria

The task is complete when:
- committed actions change state during resolution;
- milestone and game-end checks run;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`025_turn_resolution.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
