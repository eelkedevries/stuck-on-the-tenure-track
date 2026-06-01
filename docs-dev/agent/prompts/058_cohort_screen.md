# Task: Add the cohort screen

## Goal

Add the cohort tracker screen.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M13. Specification §5 and §4.9. Depends on `054`, `047`.

## Required changes

1. Render the public cohort tracker.

## Do not implement

Do not:
- expose private rival state;
- implement the CV screen (that is `060`).

## Acceptance criteria

The task is complete when:
- the screen shows rivals' public outputs only;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`058_cohort_screen.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
