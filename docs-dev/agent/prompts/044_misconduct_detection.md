# Task: Implement misconduct detection

## Goal

Implement the detection model so that misconduct has non-positive expected value.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M9. Specification §4.8. Depends on `043`, `030`.

## Required changes

1. Make detection depend on visibility, co-authors, data sharing, time since publication, whistleblower risk, and random scrutiny.
2. Detection triggers retraction and reputation/h-index loss.
3. Calibrate so a misconduct strategy has non-positive expected value across many playthroughs.

## Do not implement

Do not:
- moralise in player-facing text;
- implement endings (that is `049`).

## Acceptance criteria

The task is complete when:
- detection probability rises with visibility and data sharing;
- a simulated misconduct strategy is not net-positive;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`044_misconduct_detection.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
