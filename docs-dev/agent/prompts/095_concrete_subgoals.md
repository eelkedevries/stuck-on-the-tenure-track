# Task: Concrete, stage-specific sub-goals

## Goal

Replace the time-based stage progress with concrete, stage-specific sub-goals
made of measurable criteria driven by what the player actually does, shown as a
short checklist plus an overall progress bar.

## Scope

A sub-goal model derived from game state, the store getters, and the bars UI.
Implement only what is described here.

## Context

Implements roadmap M17 (clarity). Specification §3, §4.1. Depends on `089`,
`094`. The sub-goal bar currently just tracks time through the stage.

## Required changes

1. Define a sub-goal per career stage as a set of criteria (label, current,
   target) read from existing state:
   - Bachelor's student: foundational theory, research methods, statistics,
     bachelor thesis (writing);
   - Master's student: advanced theory, methods, statistics, master's thesis;
   - PhD researcher: publications, methods mastery, dissertation;
   - Postdoc: publication record, a grant won, reputation;
   - Assistant professor: publications, grants, teaching, service.
2. Compute overall sub-goal progress as the average of each criterion's
   completion (capped at 100%).
3. Show the sub-goal as a short checklist (criterion, current/target, met tick)
   plus the overall progress bar, beside the tenure bar.
4. Lower the new-game starting expertise a little so early progress starts low
   and visibly grows as the player studies.

## Do not implement

Do not:
- gate stage advancement on the sub-goal (it remains time/turn driven);
- add new action categories or systems.

## Acceptance criteria

The task is complete when:
- each stage shows a specific sub-goal checklist with current/target values;
- overall progress grows as the player works toward those criteria;
- `npm run check` passes.

## Checks

Run `npm run check`; run `npm run dev` and confirm the sub-goal checklist and
progress read clearly and change with play.

## Commit and push

Commit and push to `main` using this file's exact filename
(`095_concrete_subgoals.md`) as the commit message.

## Final report

End with the required final report specified in `AGENTS.md`.
