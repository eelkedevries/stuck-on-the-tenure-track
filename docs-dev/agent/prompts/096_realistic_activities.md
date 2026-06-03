# Task: Make activities realistic for each stage

## Goal

Ensure every location's activities fit the player's career stage. In
particular, for students the seminar room (and similar academic spaces) should
be about learning and earning credits, not networking.

## Scope

Adjust the stage × location activity map. Implement only what is described here.

## Context

Implements roadmap M17 (clarity/realism). Specification §3, §4.11. Depends on
`084`, `095`. Some student activities map to the wrong category (e.g. the
seminar room "Attend a seminar" counts as networking rather than learning).

## Required changes

1. Review the activities for each stage and fix any that are unrealistic for
   that stage. For Bachelor's/Master's students, academic spaces (seminar room,
   classroom, library, lab) should be learning activities that build knowledge
   and credits (study category), not networking.
2. Keep genuinely social spaces social (café/pub), and keep later-stage
   activities (PhD onward) as appropriate to those stages.

## Do not implement

Do not:
- add new locations, action categories, or mechanics;
- change later-stage activities that are already realistic.

## Acceptance criteria

The task is complete when:
- student academic activities build learning/credits, not networking;
- each stage's activities read as realistic for that stage;
- `npm run check` passes.

## Checks

Run `npm run check`; run `npm run dev` and confirm a student's seminar-room and
classroom activities are about learning.

## Commit and push

Commit and push to `main` using this file's exact filename
(`096_realistic_activities.md`) as the commit message.

## Final report

End with the required final report specified in `AGENTS.md`.
