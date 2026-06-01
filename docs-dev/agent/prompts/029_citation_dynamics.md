# Task: Implement citation dynamics

## Goal

Implement long-tailed, tier-dependent citation accrual.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M4. Specification §4.3 (citation dynamics). Depends on `027`.

## Required changes

1. Accrue citations long-tailed, concentrated in years 2–5, with top-tier papers receiving substantially more.
2. Record `citations_history`.

## Do not implement

Do not:
- compute the h-index (that is `030`);
- implement retraction effects beyond stopping accrual.

## Acceptance criteria

The task is complete when:
- simulated accrual is tier-dependent and peaks in years 2–5;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`029_citation_dynamics.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
