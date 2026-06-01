# Task: Implement layer inheritance and override

## Goal

Implement Layer 3 → Layer 2 → Layer 1 lookup precedence with same-id override.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M1. Specification §2 (inheritance and override). Depends on `014`.

## Required changes

1. Implement runtime lookup precedence L3 → L2 → L1.
2. A Layer-3 object overrides a lower-layer object with the same `event_id`; Layer-1 objects remain universal.

## Do not implement

Do not:
- author real content;
- build event resolution into the turn loop.

## Acceptance criteria

The task is complete when:
- given test fixtures, a Layer-3 override wins over Layer 2;
- a Layer-1-only object is still found;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`015_three_layer_inheritance.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
