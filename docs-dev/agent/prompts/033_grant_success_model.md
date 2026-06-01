# Task: Implement the grant success model

## Goal

Implement the grant success model.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M5. Specification §4.4. Depends on `032`.

## Required changes

1. Compute success from base rate, writing expertise, politics expertise, time invested, prior grants, publication record, and luck.

## Do not implement

Do not:
- author funder content;
- implement tenure logic (that is `049`).

## Acceptance criteria

The task is complete when:
- higher writing, politics, and record raise success probability monotonically;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`033_grant_success_model.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
