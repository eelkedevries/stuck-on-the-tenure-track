# Task: Add deadline waiting and countdown

## Goal

When the player is at a location with an upcoming deadline/appointment activity, add a clear option to wait until that activity starts, and show a deadline countdown/progression bar that can run out before the turn ends.

## Scope

Update deadline/appointment interaction and UI clarity only. Preserve the existing turn time economy, location system, appointment/deadline consequence model, and action categories unless a minimal adapter is needed. Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Read:
- `AGENTS.md`
- `src/App.svelte`
- `src/ui/BoardScreen.svelte`
- `src/ui/AppointmentBar.svelte`
- `src/ui/DeadlineBoard.svelte`
- `src/ui/game.svelte.ts`
- `src/appointments/appointments.ts`
- `src/deadlines/`
- `src/locations/stages.ts`
- `src/engine/actions.ts`
- `docs-dev/reference/primary_authoritative/specification.md` §3, §4.2, §4.11, §4.11a

Observed issues:
1. When the player arrives early at a location with a deadline/appointment activity, there should be an explicit option to wait until that activity starts.
2. Deadline/appointment pressure should have its own countdown/progression bar that can run out before the end of the turn. It should be clear that the deadline may expire even when turn time remains.

## Required changes

1. Add a “wait until deadline activity starts” option:
   - when the player is at the location of an upcoming deadline/appointment activity;
   - and the deadline/appointment has not started or is not yet due;
   - show an extra activity-style option such as “Wait until lecture starts”, “Wait for exam”, or “Wait until deadline activity starts”.
2. The wait option must spend the appropriate amount of current-turn time:
   - it should advance the turn clock to the deadline/appointment start time or due time;
   - it must not spend more time than remains in the turn;
   - it must resolve any deadline/appointment state that should occur when time advances.
3. After waiting, the actual deadline/appointment activity must become clear and actionable:
   - the player should still need to click/spend time on the actual deadline activity to complete/attend it, unless the existing current implementation explicitly treats waiting as attendance;
   - if the current implementation already requires clicking the deadline activity, preserve that behaviour.
4. Add a deadline/appointment countdown/progression bar:
   - show the time remaining until the next relevant deadline/appointment;
   - the bar should visibly run down independently of the full turn-time bar;
   - it must be clear that this deadline can expire before the turn ends;
   - include readable text such as `Lecture starts in 20 time` or `Deadline in 15 / 40`.
5. The deadline countdown must update when:
   - the player moves;
   - the player spends time on normal activities;
   - the player uses the wait option;
   - the deadline/appointment is completed, attended, missed, or no longer relevant.
6. If a deadline/appointment expires while turn time remains:
   - resolve it using the existing missed/overdue consequence model;
   - do not end the turn solely because the deadline expired;
   - do not create a game-over condition.
7. Keep the UI concise and mobile-friendly:
   - the wait option should appear only when relevant;
   - the countdown bar should not duplicate the whole deadline board;
   - do not rely on colour alone.
8. Preserve existing mechanics:
   - do not change the total turn length;
   - do not change travel costs;
   - do not redesign the whole deadline engine;
   - do not create new save-schema fields unless strictly necessary.

## Do not implement

Do not implement:
- new locations;
- new career stages;
- new resources;
- a full quest system;
- a new deadline engine;
- a new appointment engine beyond the minimal changes needed for waiting and countdown display;
- changes to rival, milestone, publication, grant, health, misconduct, or tenure systems;
- a full HUD redesign;
- new content packs.

## Acceptance criteria

The task is complete when:
- arriving early at a location with an upcoming deadline/appointment activity shows an extra wait option;
- clicking the wait option advances turn time to the relevant deadline/appointment start or due time;
- after waiting, the actual deadline/appointment activity is clearly actionable;
- the player must still complete/attend the actual activity if that is how the current implementation handles deadline activity completion;
- a deadline/appointment countdown/progression bar is visible when relevant;
- the deadline countdown can run out before the turn-time bar reaches zero;
- if the deadline expires while turn time remains, the deadline/appointment resolves as missed/overdue using existing-style consequences;
- the full turn does not end merely because a deadline expires;
- the UI remains readable on mobile;
- `npm run check` passes.

## Checks

Run `npm run check`.

Run `npm run dev` and manually verify:
1. Start or resume a game with an upcoming deadline/appointment, such as a lecture or exam.
2. Move to the relevant location before the deadline/appointment starts.
3. Confirm an extra wait option appears.
4. Click the wait option and confirm turn time advances appropriately.
5. Confirm the actual deadline/appointment activity becomes clear and actionable.
6. Complete/attend the activity and confirm it resolves favourably.
7. In another run or state, let the deadline/appointment countdown expire before the full turn time reaches zero.
8. Confirm the deadline/appointment resolves as missed/overdue and the turn continues if time remains.
9. Confirm the deadline countdown/progression bar updates after movement, activity spending, and waiting.

## Commit and push

If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename as the commit message, then push.

Do not create a branch. Do not open a pull request unless explicitly instructed.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
