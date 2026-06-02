# Task: Stage-appropriate named activities per location

## Goal

Give each location concrete, named activities that change by career stage, so a
student attends lectures, sits exams, and studies in the classroom/library/
seminar room rather than seeing generic "research/teaching" buttons. Students
build expertise without publishing papers.

## Scope

Extend the existing stage-variation map and board UI, and gate publishing by
stage. Implement only what is described here.

## Context

Implements roadmap M17. Specification §3, §4.11. Depends on `078`, `083`, `075`.
Today `src/locations/stages.ts` varies action categories and a focus label by
stage but only for PhD/postdoc/assistant professor, and the board shows raw
category buttons; student stages fall back to academic categories that do not
fit a student.

## Required changes

1. In `src/locations/stages.ts`, model named **activities** per stage and
   location (`{ label, category }`), covering all stages including undergraduate
   and MSc (e.g. classroom → Attend lecture / Take an exam; library → Study /
   Revise; seminar room → Attend a seminar). Each activity maps to an existing
   internal action category. Keep a focus label per stage/location. Unmapped
   stage/location pairs fall back to the location's base categories.
2. Update `BoardScreen` (and the store) to show the named activities for the
   current stage and location, spending time into each activity's underlying
   category.
3. Gate publishing and grants by stage in `src/engine/outcomes.ts`: students
   (undergraduate, MSc) do not create papers or win grants; their study time
   still builds expertise. Research-career stages (PhD onward) publish as now.
4. Note the student-stage activities in specification §4.11 and bump the spec
   version.

## Do not implement

Do not:
- add new action categories or new locations;
- change the time-point economy or the career arc/pacing;
- add generic life-management activities.

## Acceptance criteria

The task is complete when:
- the board shows stage-appropriate named activities (students study/attend
  lectures/sit exams; later stages run studies, write papers, chase grants);
- students build expertise but do not publish papers or win grants;
- `npm run check` passes.

## Checks

Run `npm run check`. Run `npm run dev` and confirm activities differ by stage in
the browser.

## Commit and push

Always commit and push directly to `main`. If and only if the scope was followed
and checks pass, create one commit on `main` using this file's exact filename
(`084_stage_activities.md`) as the commit message, then push `main`.

## Final report

End with the required final report specified in `AGENTS.md`.
