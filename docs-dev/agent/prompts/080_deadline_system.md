# Task: Add the deadline / pressure system

## Goal

Give the player a visible sense of what is approaching, due, or overdue, and
make deadlines create trade-offs whose misses feed existing systems rather than
ending the game.

## Scope

Deadline model, calendar scheduling, urgency UI, and missed-deadline
consequences. Implement only what is described here.

## Context

Implements roadmap M17. Specification §4.4 (grant calls already calendar-bound),
§4.10 (milestones), and the new deadlines section from `074`. Depends on `032`,
`048`, `077` (deadlines collection), `078`.

## Required changes

1. Define a deadline object (type, due date on the calendar, status) and a
   scheduler. Seed the first deadlines from existing calendar-bound systems —
   grant calls — and milestone reviews; the model should accommodate paper
   revisions, teaching prep, health, and relationship deadlines later.
2. Add a readable urgency UI surfacing **due now / soon / later / overdue** that
   supports the board rather than replacing it.
3. Apply missed-deadline consequences that feed existing systems (delays,
   reputation/relationship/health costs, missed opportunities) — not immediate
   game-over.

## Do not implement

Do not:
- create win/lose conditions independent of the existing milestones/tenure;
- flood the player with deadlines — keep density and severity tuned;
- add the diary, rival sightings, or stage variation (later prompts).

## Acceptance criteria

The task is complete when:
- deadlines are scheduled on the calendar and shown with urgency categories;
- missing a deadline produces a consequence in an existing system, not failure;
- `npm run check` passes.

## Checks

Run `npm run check`. Where visible, run `npm run dev` and confirm a deadline
approaches, can be met or missed, and a miss has a consequence.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request.
If and only if the scope was followed and checks pass, create one commit on
`main` using this file's exact filename (`080_deadline_system.md`) as the commit
message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
