# Task: Save to local browser storage

## Goal

Save to, load from, and reset a single local-browser-storage slot.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M2. Specification §5 and §8 (one slot, reset). Depends on `019`.

## Required changes

1. Save serialised state to local storage at turn end.
2. Load it on start.
3. Reset/new-game clears the slot.

## Do not implement

Do not:
- add multiple save slots;
- add cloud sync or accounts (out of scope, §9).

## Acceptance criteria

The task is complete when:
- saving then reloading restores state;
- reset clears the slot;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`020_local_storage_saves.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
