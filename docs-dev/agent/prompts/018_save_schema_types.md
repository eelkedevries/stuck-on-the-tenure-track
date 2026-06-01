# Task: Define the save-schema types

## Goal

Define the save-schema types exactly as specified.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M2. Specification §8 (save schema). Depends on `017`.

## Required changes

1. Define the save object types (`save_version`, `game_seed`, `calendar`, `settings`, `player`, `rivals`, `events_history`) matching the specification.

## Do not implement

Do not:
- implement serialisation (that is `019`);
- implement local storage (that is `020`).

## Acceptance criteria

The task is complete when:
- the save types compile and match the specified fields;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`018_save_schema_types.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
