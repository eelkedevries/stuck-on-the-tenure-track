# Task: Tune movement cost and add location memory

## Goal

Make movement create meaningful opportunity costs without dominating play, and
make where the player spends time matter through location-visit consequences.

## Scope

Movement-cost model and location-memory consequences, building on the visit
history and the ghost penalty. Implement only what is described here.

## Context

Implements roadmap M17. Specification §4.11. Depends on `053` (ghost penalty),
`077` (location_visits), `078` (board slice).

## Required changes

1. Define the abstract movement (context-switch) cost so that spreading across
   many locations in a turn costs more than staying focused, but a single move
   is cheap — movement should shape decisions, not dominate them.
2. Record visits to `location_visits` and generalise `src/locations/ghost.ts`
   into location-memory consequences over a window: e.g. never appearing in
   visibility-relevant locations lowers visibility; always staying in the lab
   improves output but weakens reputation; never going home erodes sleep.
3. Keep consequences connected to existing systems (reputation, visibility,
   wellbeing); surface them so the player can understand them.

## Do not implement

Do not:
- add deadlines, diary, rival sightings, or stage variation (later prompts);
- make movement a route-optimisation puzzle.

## Acceptance criteria

The task is complete when:
- movement cost scales with how much the player spreads out, and a single move
  is inexpensive;
- visit patterns produce readable consequences via existing systems;
- `npm run check` passes.

## Checks

Run `npm run check`. Where visible, run `npm run dev` and confirm movement cost
and at least one visit-pattern consequence.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request.
If and only if the scope was followed and checks pass, create one commit on
`main` using this file's exact filename (`079_movement_and_location_memory.md`)
as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
