# Task: Timed appointments you must attend

## Goal

Add fixed appointments within a turn — a lecture, an exam, a grant interview —
that require the player to be at a particular location by a point in the turn's
clock, shown with a time-remaining bar; missing one has consequences.

## Scope

Add a within-turn appointment system and its UI. Implement only what is
described here.

## Context

Implements roadmap M17 (pressure, story). Specification §4.11a, §3. Depends on
`088` (turn clock), `089` (bars/stress), `090` (board), `077` (save state).
Appointments are within-turn (run on the time-point clock), distinct from the
calendar-scale deadlines.

## Required changes

1. Model an appointment: a title, a location, a time-point in the turn by which
   the player must be there, a type (lecture, exam, grant interview), and a
   status. Schedule stage-appropriate appointments (e.g. students get lectures
   and exams; later stages get grant interviews) — not every turn, and tuned so
   they create pressure without constant crisis.
2. As the turn clock advances, resolve an appointment when its time arrives:
   present at the location → attended (small benefit); absent → missed
   (consequence feeding existing systems — stress up, reputation/opportunity
   cost). Never an immediate game-over.
3. Show the next appointment with a **time-remaining bar** (and its location) so
   the player can plan around it.

## Do not implement

Do not:
- create win/lose conditions independent of milestones/tenure;
- flood the player with appointments.

## Acceptance criteria

The task is complete when:
- appointments are scheduled by stage and shown with time remaining and location;
- attending resolves them; missing applies a consequence, not a game-over;
- `npm run check` passes.

## Checks

Run `npm run check`; run `npm run dev` and confirm an appointment can be attended
or missed with the expected effect.

## Commit and push

Commit and push to `main` using this file's exact filename
(`091_timed_appointments.md`) as the commit message.

## Final report

End with the required final report specified in `AGENTS.md`.
