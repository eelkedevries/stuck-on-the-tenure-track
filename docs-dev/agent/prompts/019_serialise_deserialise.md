# Task: Serialise and deserialise game state

## Goal

Serialise and deserialise the full game state to and from JSON without loss.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M2. Specification §8 and §1.3 (lossless JSON). Depends on `017`, `018`.

## Required changes

1. Implement `serialise(state)` to JSON and `deserialise(json)` to state.
2. The round-trip must be lossless.

## Do not implement

Do not:
- persist to storage (that is `020`);
- add migrations beyond a version field.

## Acceptance criteria

The task is complete when:
- a round-trip of a sample state is deep-equal to the original;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`019_serialise_deserialise.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
