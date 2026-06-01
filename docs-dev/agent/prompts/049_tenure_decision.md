# Task: Implement the tenure decision

## Goal

Implement the partly stochastic tenure decision and the win condition.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M11. Specification §4.10. Depends on `048`, `030`, `033`.

## Required changes

1. Weigh publications, citations, grants, teaching, and service with a stochastic component.
2. Make the win condition the first tenured offer in the cohort.

## Do not implement

Do not:
- implement the CV screen (that is `060`);
- implement post-tenure gameplay (out of scope, §9).

## Acceptance criteria

The task is complete when:
- strong candidates are usually but not always promoted;
- the first tenured offer ends the game as a win;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`049_tenure_decision.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
