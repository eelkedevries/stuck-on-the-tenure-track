# Task: Implement the turn-loop skeleton

## Goal

Implement the 7-phase turn loop skeleton with stubbed phases.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M3. Specification §4.2 (turn engine). Depends on `020`, `021`, `022`.

## Required changes

1. Implement the loop: turn start → event → action → resolution → rival → save → end, calling stubbed phase functions.
2. The save phase uses the local-storage saves from `020`.

## Do not implement

Do not:
- implement time-point or action allocation (that is `024`);
- implement resolution logic (that is `025`);
- implement rivals (that is `046`).

## Acceptance criteria

The task is complete when:
- running a turn advances the calendar and saves;
- the phases are called in order;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`023_turn_loop_skeleton.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
