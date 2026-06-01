# Task: Expose the public cohort tracker

## Goal

Expose a public-only cohort tracker.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M10. Specification §4.9. Depends on `046`.

## Required changes

1. Expose rivals' public outputs only: rank, publications, h-index, major recent events, and institution prestige. Keep private wellbeing, relationships, and misconduct hidden.

## Do not implement

Do not:
- render the tracker UI (that is `058`);
- expose any private rival state.

## Acceptance criteria

The task is complete when:
- only public fields are exposed;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`047_cohort_tracker.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
