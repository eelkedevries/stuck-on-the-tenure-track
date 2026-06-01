# Task: Define grant objects

## Goal

Define the grant object type with eligibility.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M5. Specification §4.4 (grant system). Depends on `017`, `021`.

## Required changes

1. Define the grant type with funder, scheme, amount, `duration_turns`, call dates, success rate, and eligibility requirements.

## Do not implement

Do not:
- implement call scheduling (that is `032`);
- author funder content (that is `064`).

## Acceptance criteria

The task is complete when:
- the grant type compiles with all specified fields;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`031_grant_objects_and_types.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
