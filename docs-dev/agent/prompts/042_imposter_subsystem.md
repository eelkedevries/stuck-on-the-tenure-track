# Task: Implement the imposter subsystem

## Goal

Implement the imposter subsystem.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M8. Specification §4.7 (imposter syndrome). Depends on `039`.

## Required changes

1. Track perceived competence, actual competence, and their gap; large gaps can auto-decline opportunities.

## Do not implement

Do not:
- implement health conditions (that is `040`);
- implement specific opportunity events.

## Acceptance criteria

The task is complete when:
- a large gap causes an opportunity to be auto-declined;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`042_imposter_subsystem.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
