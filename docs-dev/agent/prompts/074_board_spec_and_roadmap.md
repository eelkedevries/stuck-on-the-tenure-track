# Task: Specify the board-game interaction redesign

## Goal

Update the binding specification and the build roadmap to define the
board-game-style interaction redesign (movement, location-bound actions,
deadlines, diary, rival sightings) as canon, so the build prompts that follow
have ground truth to implement against.

## Scope

Documentation only. Do not write application or content code. Implement only
the specification and roadmap changes described here.

## Context

Implements the new milestone M17 (board interaction redesign), from the design
brief approved by the maintainer. Affects specification §3 (calendar/turns),
§4.2 (turn loop), §4.11 (campus/map), §8 (save schema), and adds a new
deadlines section. Depends on the existing spec.

## Required changes

1. In `docs-dev/reference/primary_authoritative/specification.md`:
   - Clarify the turn model (§3/§4.2): a turn remains an abstract, long career
     step (the existing per-stage 6–12 month calendar is unchanged); within a
     turn the player moves across a campus/life board and spends a finite
     time-point budget. Movement is an **abstract context-switching cost**, not
     literal travel time.
   - Make the campus board the primary interaction surface (§4.11): the player
     has a current location, moves between locations at a time cost, and chooses
     location-bound actions; the broad action categories remain the internal
     effect taxonomy.
   - Add a **deadlines** subsection: deadline objects tied to the calendar,
     urgency states (due now / soon / later / overdue), and missed-deadline
     consequences that feed existing systems rather than ending the game.
   - Extend the save schema (§8) to note new persisted fields: current location,
     within-turn time remaining, a deadlines collection, and a location-visit
     history; record that the save version will be bumped and old single-slot
     saves reset.
   - Bump the spec `Version` and `Last updated` metadata.
2. In `docs-dev/planning/build_roadmap.md`: add milestone M17 with rows for
   prompts `074`–`083` in dependency order.
3. In `docs-dev/planning/current_state.md`: note that M17 is specified and in
   progress.

## Do not implement

Do not:
- write engine, UI, or content code;
- change the per-stage turn calendar (turns stay 6–12 months by stage);
- introduce rent/groceries/transport or any generic life-management economy.

## Acceptance criteria

The task is complete when:
- the specification describes the board interaction, movement cost, deadlines,
  and the save-schema additions, with a bumped version;
- the roadmap lists M17 / `074`–`083`;
- `npm run check` passes (no code changed, so the build is unaffected).

## Checks

Run `npm run check`.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request.
If and only if the scope was followed and checks pass, create one commit on
`main` using this file's exact filename (`074_board_spec_and_roadmap.md`) as the
commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
