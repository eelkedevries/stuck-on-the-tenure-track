# Task: Fix activity selection and deadline action clarity

## Goal

Fix board activity selection so spending time on one activity only marks that specific activity as used, make deadline-linked activities explicit and clickable, and make each activity’s positive and negative effects clearer before the player spends time.

## Scope

Update the board activity interaction and display only. Preserve the existing internal action categories and outcome model unless a minimal adapter is needed to track which visible activity was selected. Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Read:
- `AGENTS.md`
- `src/ui/BoardScreen.svelte`
- `src/ui/game.svelte.ts`
- `src/locations/stages.ts`
- `src/appointments/appointments.ts`
- `src/deadlines/`
- `src/engine/actions.ts`
- `src/engine/outcomes.ts`
- `docs-dev/reference/primary_authoritative/specification.md` §4.2, §4.11, §4.11a

Current observed problems:
1. When a location has more than one activity using the same internal category, clicking to spend time on one activity can make it look as if time was spent on all activities in that category.
2. For deadline-linked or appointment-linked activities, such as attending a lecture, merely arriving at the correct location is not clear enough. The relevant activity should become prominent, and the player should explicitly click to spend time on that deadline activity.
3. Activity cards need clearer previews of both the positive and negative consequences of spending time, such as skill/standing/career benefits and wellbeing/stress costs.

## Required changes

1. Fix activity-specific spending display:
   - ensure that when the player clicks one visible activity, only that activity is marked as having time spent on it;
   - do not show the same spent-time marker on all activities that share the same internal action category;
   - keep the existing internal category allocation for outcome calculation unless a minimal additional activity-level tracking map is needed for UI display.
2. Add stable activity identifiers if needed:
   - each visible activity should have a stable id or equivalent key;
   - activity-level display state should use this identifier rather than only the internal action category.
3. Make deadline-linked or appointment-linked activities explicit:
   - when the player has an active appointment/deadline tied to a location, and the player arrives at that location, show the relevant activity prominently at the top of the activity list;
   - label it clearly, for example “Deadline activity”, “Lecture due now”, or another concise player-facing label;
   - the player must click/spend time on this activity to attend/complete it;
   - merely being at the correct location should not automatically count as completing the activity unless the existing specification explicitly requires that behaviour.
4. Update appointment/deadline resolution accordingly:
   - a pending appointment should resolve favourably only after the player spends the required time on the linked activity;
   - if the appointment time passes without the linked activity being completed, resolve it as missed using the existing consequence model;
   - do not introduce game-over conditions.
5. Improve activity effect previews:
   - each activity card should clearly show likely positive effects and likely negative effects before the player clicks it;
   - use concise player-facing labels such as “Skill +”, “Standing +”, “Career +”, “Stress +”, “Wellbeing −”, “Sleep −”, or similarly readable wording;
   - avoid exposing formulas or long raw stat lists;
   - where exact downstream effects are stochastic or indirect, show a truthful approximate hint rather than pretending to guarantee exact outcomes.
6. Preserve existing mechanics:
   - selected activities should still feed into the existing action categories and outcome systems;
   - do not create new resource systems;
   - do not change save schema unless strictly necessary for current-turn UI state.
7. Keep the board mobile-friendly and accessible:
   - highlighted deadline activities must not rely on colour alone;
   - text should remain concise;
   - buttons/cards should remain keyboard accessible.

## Do not implement

Do not implement:
- new locations;
- new career stages;
- new resources;
- a full quest system;
- a new deadline engine;
- a new appointment engine beyond the minimal changes needed for explicit clickable deadline activities;
- a redesign of the whole board screen;
- changes to unrelated event content;
- changes to the tenure, publication, grant, health, or rival algorithms unless required to keep existing behaviour working.

## Acceptance criteria

The task is complete when:
- clicking one activity only marks that specific visible activity as used, even if other activities share the same internal action category;
- activity-level spent-time display no longer incorrectly appears on all activities in the same category;
- arriving at a location with an active deadline/appointment makes the relevant activity extra clear;
- the player must click/spend time on the deadline-linked activity to complete it;
- missing the deadline-linked activity still resolves with an existing-style consequence, not a game over;
- activity cards show clear positive and negative effect previews before selection;
- the UI remains readable on mobile;
- `npm run check` passes.

## Checks

Run `npm run check`.

Run `npm run dev` and manually verify:
1. At a location with multiple activities sharing the same internal category, click one activity and confirm only that activity shows spent time.
2. Trigger or inspect a turn with an appointment/deadline activity, such as a lecture, and confirm that arriving at the location highlights the relevant activity rather than auto-completing it.
3. Click the highlighted deadline activity and confirm it resolves favourably.
4. Let a deadline/appointment pass without clicking the linked activity and confirm it resolves as missed.
5. Inspect several activity cards and confirm they show concise positive and negative effect previews.

## Commit and push

If and only if the scope was followed and checks pass, create one commit on `main` using this file’s exact filename as the commit message, then push.

Do not create a branch. Do not open a pull request unless explicitly instructed.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
