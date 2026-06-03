# Task: Progression clarity pass

## Goal

Make career progression clearer by adding a current-turn time bar, ensuring the player and cohort all start as Bachelor’s students, and making Bachelor’s, Master’s, and PhD completion prominent goals and milestone events.

## Scope

Update progression-related UI, cohort starting-stage consistency, and milestone presentation. Preserve the existing turn economy, rival archetypes, career-stage structure, and tenure endpoint unless a minimal adjustment is required to fix inconsistent labels or milestone presentation. Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Read:
- `AGENTS.md`
- `src/App.svelte`
- `src/ui/BoardScreen.svelte`
- `src/ui/StatusBars.svelte`
- `src/ui/CohortScreen.svelte`
- `src/ui/DiaryScreen.svelte`
- `src/ui/game.svelte.ts`
- `src/engine/actions.ts`
- `src/state/newgame.ts`
- `src/calendar/stages.ts`
- `src/rivals/archetypes.ts`
- `src/rivals/simulation.ts`
- `src/rivals/cohort.ts`
- `src/milestones/milestones.ts`
- `src/milestones/subgoals.ts`
- `content/`
- `docs-dev/reference/primary_authoritative/specification.md` §3, §4.2, §4.9, §4.10, §4.11, §7

Observed issues:
1. The turn screen should show a progression bar for how much time remains in the current turn.
2. The cohort/competitors appear to already be at PhD level. The player and cohort should all start as Bachelor’s/undergraduate students.
3. Bachelor’s, Master’s, and PhD completion are not sufficiently clear as major goals. Getting the Bachelor’s diploma, Master’s diploma, and PhD/defence should receive special attention.

## Required changes

### A. Add a current-turn time progression bar

1. Add a visible progress bar for current-turn time remaining.
2. The bar must update when the player:
   - moves between locations;
   - spends time on an activity;
   - relaxes or ends the turn through time depletion.
3. The bar must show readable text as well as visual progress, for example:
   - `Time left: 65 / 100`
   - or equivalent concise wording.
4. Place the bar prominently in the main turn/board screen.
5. Keep it accessible:
   - do not rely on colour alone;
   - expose the value as text;
   - keep labels clear for screen readers where appropriate.
6. Preserve the existing time-point budget and mechanics. This is a UI clarity change only.

### B. Make the player and cohort start as Bachelor’s students

1. Inspect rival/cohort initialisation and display logic to identify why rivals appear to start at PhD level.
2. Ensure a new game starts with:
   - the player at Bachelor’s/undergraduate stage;
   - all rivals/cohort competitors also at Bachelor’s/undergraduate stage;
   - no inappropriate PhD-level titles, outputs, publications, grants, or rank labels at turn 0.
3. Ensure cohort stage/rank labels are derived consistently from the same career-stage timeline as the player, unless the existing architecture has a clearly better single source of truth.
4. Ensure rivals progress stage-appropriately over time.
5. Keep rival archetypes intact:
   - grinder;
   - networker;
   - gambler;
   - genuine scholar.
6. Keep public rival information limited to the intended public cohort tracker information.
7. Update user-facing labels so “Bachelor’s student”, “Master’s student”, “PhD student”, etc. are displayed at the appropriate stages.
8. If useful and simple within the existing setup, add a small regression check for cohort starting stage. Do not add a new test framework.

### C. Make diplomas and PhD defence clear goals and milestone events

1. Review current milestone and subgoal logic for undergraduate, MSc, and PhD stages.
2. Make stage goals explicitly diploma-oriented:
   - undergraduate stage → work towards earning the Bachelor’s diploma;
   - MSc stage → work towards earning the Master’s diploma;
   - PhD stage → work towards completing/defending the PhD dissertation.
3. Ensure the main goal/progress display communicates these goals clearly, using concise player-facing wording.
4. Add or improve special milestone-completion presentation for:
   - Bachelor’s diploma awarded;
   - Master’s diploma awarded;
   - PhD dissertation defended / PhD completed.
5. These milestone events should receive more attention than ordinary diary recap lines. Use the existing UI flow if possible; a compact milestone panel/screen, prominent recap block, or equivalent is acceptable.
6. Make the milestone presentation celebratory but still dry and consistent with the game’s academic satire.
7. Ensure the milestone event clearly tells the player:
   - what was achieved;
   - what stage comes next;
   - why it matters mechanically or narratively.
8. Do not make these milestones independent win conditions beyond the existing career progression and tenure endpoint.
9. Update `docs-dev/planning/current_state.md` only if this prompt introduces a key milestone-presentation decision worth recording.

## Do not implement

Do not implement:
- new time mechanics;
- changes to turn length;
- changes to travel costs;
- new career stages;
- post-tenure gameplay;
- new degree types beyond Bachelor’s, Master’s, and PhD;
- a full cutscene system;
- new rival archetypes;
- multiplayer;
- detailed rival wellbeing or hidden-state display;
- new activity/deadline systems;
- new save-schema fields unless strictly necessary;
- a full HUD redesign;
- changes to publication, grant, health, misconduct, or tenure algorithms except where labels or milestone display require existing values to be shown more clearly.

## Acceptance criteria

The task is complete when:
- the main turn/board screen shows a clear time-remaining progression bar;
- the time bar updates after movement and activity spending;
- the existing turn still ends when time reaches zero;
- starting a new game shows the player and all rivals/cohort competitors at Bachelor’s/undergraduate level;
- rivals no longer appear to start as PhD students;
- cohort labels remain stage-appropriate as the game advances;
- the undergraduate stage clearly presents earning the Bachelor’s diploma as the goal;
- the MSc stage clearly presents earning the Master’s diploma as the goal;
- the PhD stage clearly presents completing/defending the PhD as the goal;
- completing each of these milestones triggers a prominent milestone event or equivalent special presentation;
- the milestone presentation says what was achieved and what comes next;
- ordinary turn recaps remain distinct from major diploma/defence milestones;
- `npm run check` passes.

## Checks

Run `npm run check`.

Run `npm run dev` and manually verify:
1. Start or resume a game.
2. Confirm the time-remaining bar is visible.
3. Move to another location and confirm the bar decreases.
4. Spend time on an activity and confirm the bar decreases again.
5. Spend all remaining time and confirm the turn resolves as before.
6. Start a new game and open the cohort/competitor view.
7. Confirm every competitor starts as a Bachelor’s/undergraduate student.
8. Confirm there are no inappropriate PhD-level labels or outputs at the start.
9. Confirm the undergraduate goal is clearly diploma-oriented.
10. Inspect or advance to the MSc and PhD stages if feasible, or use the relevant state/milestone logic to confirm labels.
11. Trigger or inspect milestone completion for Bachelor’s, Master’s, and PhD if feasible.
12. Confirm milestone completion is more prominent than an ordinary recap line.
13. Confirm the game still progresses towards the long-term tenure goal.

## Commit and push

If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename as the commit message, then push.

Do not create a branch. Do not open a pull request unless explicitly instructed.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
