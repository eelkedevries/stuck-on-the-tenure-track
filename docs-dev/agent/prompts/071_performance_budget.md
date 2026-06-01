# Task: Meet the performance budgets

## Goal

Measure and meet the performance budgets.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M16. Specification §5 (performance targets). Depends on `059`, `070`.

## Required changes

1. Measure and meet bundle < 5 MB, time-to-interactive < 3 s on a mid-range smartphone over 4G, and turn resolution < 1 s.
2. Optimise where needed.

## Do not implement

Do not:
- add deployment (that is `072`);
- add new gameplay.

## Acceptance criteria

The task is complete when:
- a production build is under 5 MB;
- turn resolution is under 1 s in a measured run;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`071_performance_budget.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
