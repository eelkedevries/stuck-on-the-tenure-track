# Task: Schedule grant calls on the calendar

## Goal

Open and close grant calls on calendar dates with eligibility gating.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M5. Specification §4.4 and §3. Depends on `031`, `021`.

## Required changes

1. Open and close calls by date.
2. Gate eligibility by rank and years since PhD.

## Do not implement

Do not:
- implement the success model (that is `033`);
- author funder content.

## Acceptance criteria

The task is complete when:
- a call is open only between its dates;
- ineligible players cannot apply;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`032_grant_calendar_calls.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
