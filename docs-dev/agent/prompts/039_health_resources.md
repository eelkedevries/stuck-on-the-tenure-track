# Task: Update coupled health resources

## Goal

Update coupled sleep, mood, and physical health each turn.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M8. Specification §4.7 (health system). Depends on `017`.

## Required changes

1. Update sleep, mood, and physical health each turn and couple them so they influence one another.

## Do not implement

Do not:
- implement conditions (that is `040`);
- implement the imposter subsystem (that is `042`).

## Acceptance criteria

The task is complete when:
- the three values update each turn and influence each other;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`039_health_resources.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
