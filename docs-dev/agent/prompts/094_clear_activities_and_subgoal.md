# Task: Clear activity effects and a current sub-goal bar

## Goal

Make it obvious what each activity does (not "10 on networking"), add a
progression bar for the current stage's sub-goal alongside the tenure bar, and
rename the student stages to "Bachelor's"/"Master's".

## Scope

Presentational/labelling plus a stage-progress helper and a sub-goal getter.
Implement only what is described here.

## Context

Implements roadmap M17 (clarity). Specification §3, §4.1, §5. Depends on `084`
(activities), `089` (bars). Activities currently show their internal action
category; only a tenure bar exists; stages display as "Undergraduate"/"MSc".

## Required changes

1. On the board, show each activity's effect in plain language (e.g. "Unwind —
   rest: eases stress, restores mood"; "Socialise — make contacts and keep
   relationships warm") instead of the raw category name.
2. Add a **current sub-goal** progression bar next to the tenure bar, with a
   short description of the stage's goal (e.g. Bachelor's: pass your courses and
   defend your thesis) and a progress measure (progress through the stage).
3. Display the student stages as "Bachelor's student" and "Master's student"
   across the UI (the internal stage ids are unchanged).

## Do not implement

Do not:
- rename the internal `Stage` ids or change mechanics;
- add new action categories.

## Acceptance criteria

The task is complete when:
- each activity shows a plain-language effect, not an internal category name;
- a sub-goal bar with a described goal and progress appears beside the tenure bar;
- student stages read as Bachelor's/Master's;
- `npm run check` passes.

## Checks

Run `npm run check`; run `npm run dev` and confirm activities and the sub-goal
read clearly.

## Commit and push

Commit and push to `main` using this file's exact filename
(`094_clear_activities_and_subgoal.md`) as the commit message.

## Final report

End with the required final report specified in `AGENTS.md`.
