# Task: Implement the paper lifecycle

## Goal

Implement the paper lifecycle transitions.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M4. Specification §4.3 (lifecycle). Depends on `026`.

## Required changes

1. Implement transitions: in preparation → submitted → revision/rejection → published → retracted, stamping the relevant dates.

## Do not implement

Do not:
- implement citation accrual (that is `029`);
- implement misconduct detection (that is `044`).

## Acceptance criteria

The task is complete when:
- a paper can move through each lifecycle state;
- dates are stamped on transition;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`027_paper_lifecycle.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
