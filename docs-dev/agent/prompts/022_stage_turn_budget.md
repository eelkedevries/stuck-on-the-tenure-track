# Task: Implement the stage turn budget

## Goal

Implement the career-stage turn budget so turn duration varies by stage.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M3. Specification §3 (career-stage turn budget). Depends on `021`.

## Required changes

1. Encode the stage turn budget (undergraduate, MSc, PhD, postdoc, assistant professor) and per-stage turn duration.
2. Advancing a turn moves the date by the stage interval.

## Do not implement

Do not:
- implement the turn-loop phases (that is `023`);
- implement events.

## Acceptance criteria

The task is complete when:
- each stage advances the date by its specified interval;
- the full game approximates 25 turns;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`022_stage_turn_budget.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
