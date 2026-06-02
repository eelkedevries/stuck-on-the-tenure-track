# Task: Make the campus board the primary interface (vertical slice)

## Goal

Replace the abstract numeric allocation screen as the primary way to play with
a board: the player has a current location, moves between locations at a time
cost, and chooses location-bound actions, drawing down the turn's time budget.

## Scope

Wire the existing board components and location model into the playable flow as
a vertical slice. Reuse `CampusMap`, `LocationList`, and `locations/types.ts`.
Implement only the slice described here.

## Context

Implements roadmap M17 and is the first genuinely board-like build.
Specification §4.2, §4.11, §5. Depends on `050`, `051`, `052`, `073`, `075`,
`076`, `077`. The numeric `ActionAllocationScreen` and the 100-point budget
remain the underlying economy.

## Required changes

1. In the orchestration store and `App.svelte`, make the board the primary turn
   interface: show `CampusMap` on desktop and `LocationList` on mobile, indicate
   the current location, and let the player move to another location at an
   abstract movement (context-switch) time cost deducted from the budget.
2. At the current location, offer that location's bound actions (from the
   location→action model). Spending time on an action draws down the budget and
   flows into the systems wired in `075`. Some actions may consume most of the
   remaining budget (e.g. running studies in the lab).
3. Commit/end-turn resolves as today (calendar advance, resolution, rivals,
   save). Keep the numeric allocation reachable or internal as the underlying
   economy; the board is what the player drives.
4. Scope the slice to a single career stage if needed to stay small; later
   prompts add tuning, deadlines, diary, and stage variation.

## Do not implement

Do not:
- build the deadline system, end-of-turn diary, rival sightings, or stage
  variation (later prompts);
- make movement a route-optimisation puzzle — keep movement cost small;
- add generic life-management actions (rent, shopping, transport).

## Acceptance criteria

The task is complete when:
- the player starts a turn at a location, can move (paying a time cost), and can
  choose location-bound actions that spend time and affect the systems;
- the turn commits, advances, and saves, and the game still reaches its end;
- `npm run check` passes.

## Checks

Run `npm run check`. Run `npm run dev` and confirm movement, location actions,
and turn commit work in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request.
If and only if the scope was followed and checks pass, create one commit on
`main` using this file's exact filename (`078_board_vertical_slice.md`) as the
commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
