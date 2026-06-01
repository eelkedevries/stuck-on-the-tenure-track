# Task: Compute the h-index

## Goal

Compute the h-index from papers rather than storing it.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M4. Specification §4.1 and §4.3 (h-index computed, not stored). Depends on `029`.

## Required changes

1. Compute the h-index from the player's papers' citations on demand.

## Do not implement

Do not:
- store the h-index in state;
- implement the rival h-index display (that is `047`).

## Acceptance criteria

The task is complete when:
- the h-index matches a known fixture;
- it is computed, not stored;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`030_h_index_computation.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
