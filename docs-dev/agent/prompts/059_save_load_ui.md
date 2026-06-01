# Task: Add save, reset, and resume controls

## Goal

Add new-game, reset, and resume controls bound to the save system.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M13. Specification §5. Depends on `054`, `020`.

## Required changes

1. Add new-game, reset, and resume controls bound to the save system.

## Do not implement

Do not:
- add multiple save slots;
- add accounts or cloud sync (out of scope, §9).

## Acceptance criteria

The task is complete when:
- resume restores a saved game;
- reset clears it;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`059_save_load_ui.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
