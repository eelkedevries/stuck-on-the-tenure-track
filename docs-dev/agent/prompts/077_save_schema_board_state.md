# Task: Extend the save schema for board state

## Goal

Add the persisted state the board, movement, deadlines, and location memory
need, and bump the save version so old saves are handled cleanly.

## Scope

Save-schema types, serialisation, and storage only. Do not build the board UI.
Implement only the schema additions described here.

## Context

Implements roadmap M17. Specification §8 (save schema). Depends on `018`, `019`,
`020`, `074`. The current schema has no place for a current location, a
within-turn time budget, deadlines, or a visit history.

## Required changes

1. Extend `SaveGame`/`SavePlayer` (`src/state/save.ts`) with: a current
   location id, a within-turn time-remaining value, a `deadlines` collection
   (JSON-serialisable; element schema may be a placeholder tightened by `080`),
   and a `location_visits` history.
2. Bump `save_version` and handle old saves on load (a one-slot beta may discard
   incompatible saves; do not attempt silent partial migration).
3. Keep `serialise`/`deserialise` lossless and update `src/state/newgame.ts` so a
   new game initialises the new fields.

## Do not implement

Do not:
- build the board, movement, deadline logic, or diary (later prompts);
- add multiple save slots or cloud sync (§9).

## Acceptance criteria

The task is complete when:
- the save schema includes the new fields and a new game initialises them;
- save round-trips losslessly and `save_version` is bumped with old saves
  handled (reset is acceptable);
- `npm run check` passes.

## Checks

Run `npm run check`.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request.
If and only if the scope was followed and checks pass, create one commit on
`main` using this file's exact filename (`077_save_schema_board_state.md`) as
the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
