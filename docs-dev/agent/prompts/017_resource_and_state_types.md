# Task: Define resource and game-state types

## Goal

Define the resource and overall game-state types.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M2. Specification §4.1 (resources). Depends on `013`.

## Required changes

1. Define types for funds, wellbeing, expertise, standing, specialisation, imposter state, and the overall game-state object.
2. Keep all fields JSON-serialisable; do not store the h-index.

## Do not implement

Do not:
- implement saves (that is `018`–`020`);
- implement any system mechanics.

## Acceptance criteria

The task is complete when:
- the types compile;
- the h-index is not a stored field;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`017_resource_and_state_types.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
