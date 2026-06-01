# Task: Implement time points and action categories

## Goal

Implement the 100-TP budget and the action categories with allocation and commit.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M3. Specification §4.2 (time points and action categories). Depends on `023`.

## Required changes

1. Give each turn 100 time points.
2. Implement the action categories (research, teaching, service, networking, funding, personal, misconduct) with allocation and commit within the budget.

## Do not implement

Do not:
- implement outcome resolution (that is `025`);
- bind actions to locations (that is `050`).

## Acceptance criteria

The task is complete when:
- allocations cannot exceed 100 time points;
- committing records the allocation;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`024_time_points_and_actions.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
