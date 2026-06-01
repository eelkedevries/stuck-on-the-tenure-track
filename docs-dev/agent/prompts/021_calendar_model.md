# Task: Implement the calendar model

## Goal

Implement the calendar with ISO dates.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M3. Specification §3 (time, turns, and calendar). Depends on `017`.

## Required changes

1. Implement the calendar with `current_date`, `turn_number`, and `start_date` as ISO dates.
2. Support advancing the date.

## Do not implement

Do not:
- implement stage budgets (that is `022`);
- implement the turn loop.

## Acceptance criteria

The task is complete when:
- advancing produces correct ISO dates;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`021_calendar_model.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
