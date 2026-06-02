# Task: A square game board with distance-based travel

## Goal

Make the campus a square game board (Jones-style): locations sit on a grid,
travelling between distant locations costs more time, and a player token visibly
moves across the board when you travel.

## Scope

Rework the board component and the movement-cost model. Implement only what is
described here.

## Context

Implements roadmap M17 (the spatial board the redesign is about). Specification
§4.11. Depends on `078`, `079`, `088`. Today the board is a small tiled grid
with an escalating per-move cost and no token.

## Required changes

1. Lay the locations out on a square grid with fixed coordinates, rendered as a
   game board that scales to the viewport (works on mobile and desktop).
2. Make travel cost proportional to grid distance between the current and target
   location (replacing the escalating per-move model); a short hop is cheap, a
   cross-board trip is dear. Keep movement meaningful but not dominant.
3. Render a player token at the current location that animates to the target
   when travelling.
4. Keep keyboard navigability and text labels on every location.

## Do not implement

Do not:
- add appointments (`091`);
- add new locations or remove existing ones;
- turn travel into a route-optimisation puzzle.

## Acceptance criteria

The task is complete when:
- the board is a square grid; far locations cost more travel time than near ones;
- a token shows the player's position and moves when travelling;
- the board is usable by keyboard and on mobile, and `npm run check` passes.

## Checks

Run `npm run check`; run `npm run dev` and confirm distance-based travel and the
moving token.

## Commit and push

Commit and push to `main` using this file's exact filename
(`090_square_board_travel.md`) as the commit message.

## Final report

End with the required final report specified in `AGENTS.md`.
