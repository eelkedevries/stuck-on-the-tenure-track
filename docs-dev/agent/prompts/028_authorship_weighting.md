# Task: Implement authorship weighting

## Goal

Implement first/last/middle-author weighting.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M4. Specification §4.3 (psychology authorship convention). Depends on `026`.

## Required changes

1. Compute author credit so the first author matters most, the last author carries senior weight, and middle authors carry reduced weight.

## Do not implement

Do not:
- compute the h-index (that is `030`);
- implement citations (that is `029`).

## Acceptance criteria

The task is complete when:
- credit ordering matches the convention for sample author lists;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`028_authorship_weighting.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
