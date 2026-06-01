# Task: Implement treatment actions

## Goal

Implement treatment actions for health conditions.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M8. Specification §4.7. Depends on `040`.

## Required changes

1. Implement GP visit, therapy, medication, reduced workload, and sick leave, each affecting conditions.

## Do not implement

Do not:
- implement the imposter subsystem (that is `042`);
- implement the CV costs list (that is `061`).

## Acceptance criteria

The task is complete when:
- each treatment changes a condition's status or severity;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`041_treatment_actions.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
