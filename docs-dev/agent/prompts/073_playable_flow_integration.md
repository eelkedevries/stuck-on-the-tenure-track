# Task: Wire the engine and screens into a playable flow

## Goal

Turn the existing engine modules and presentational screens into a single
playable beta: a new game starts, turns advance, state persists, and the game
ends on a CV. Today `App.svelte` only renders a placeholder.

## Scope

Implement only the integration described here. Reuse the existing engine and
screen components as-is. Do not add new gameplay, mechanics, or content.

## Context

Implements the integration the screen prompts (`055`–`062`) deferred: those
screens are presentational and were never wired into a flow. Specification §4.2
(turn loop), §4.1 (resources), §4.9 (cohort), §4.12 (end-game CV), §5 (UI), §8
(save schema). Depends on `023`, `024`, `025`, `046`, `047`, `055`, `057`,
`058`, `059`, `060`–`062`, `019`, `020`, `030`, `049`.

## Required changes

1. Add a new-game bootstrap (e.g. `src/state/newgame.ts`) that builds a valid
   starting `SaveGame` (the §8 schema and §4.1 starting resources) and an
   initial cohort of three rivals (§4.9), seeded deterministically from
   `game_seed`. No new fields beyond the existing save schema.
2. Add an app-state orchestration store (e.g. `src/ui/game.svelte.ts`, Svelte 5
   runes) holding the live `SaveGame`, the rivals, the current view, and the
   working `Allocation`. Provide actions: `newGame`, `resume`, `reset` (via
   `src/state/storage.ts`); `allocate`/`commitTurn` (commit runs `runTurn` from
   `src/engine/turn.ts` for the current stage via `stageForTurn`, advancing the
   calendar, resolving, simulating rivals, and saving); `showCohort`/`showTurn`;
   and end-game detection (the player is tenured, per `src/milestones/tenure.ts`
   / `resolution.isGameOver`).
3. Wire `App.svelte` to render, inside `Shell`, the right existing screen for
   the current view and bind its typed props and callbacks to the store:
   `SaveLoadControls` (start), `TurnScreen` + `ActionAllocationScreen` (play),
   `CohortScreen` (cohort), `CvScreen` (end). Do not change the screens'
   markup or styles.
4. Build `CvData` (§4.12) from the final `SaveGame` for the end screen:
   publications and citations from `papers`, h-index via `src/papers/hindex.ts`,
   grants from `grants_held`, and the costs list from recorded state where a
   source exists (otherwise zero/empty — do not fabricate values).

## Do not implement

Do not:
- add event selection or gating, or wire `EventScreen` (a separate prompt);
- add new mechanics, systems, content packs, or screen components;
- change the existing screen components' markup or styles;
- add multiple save slots, accounts, or cloud sync (§9).

## Acceptance criteria

The task is complete when:
- the app opens on a start screen; **New game** begins a playable turn loop;
- committing an allocation advances the turn, updates the visible resources and
  cohort, and writes the save;
- **Resume** restores the saved game and **Reset** clears it;
- reaching the end (tenured) shows the CV screen built from final state;
- `npm run check` passes.

## Checks

Run `npm run check`. Run `npm run dev` and confirm in the browser that a new
game starts, a turn commits and advances, the save persists across reload, and
the end-game CV renders.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request.
If and only if the scope was followed and checks pass, create one commit on
`main` using this file's exact filename (`073_playable_flow_integration.md`) as
the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
