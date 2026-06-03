# Task: Add a clear this-term objective panel

## Goal

Make each turn easier to understand by adding a compact “This term” panel that states the immediate objective, current pressure, and one useful optional focus.

## Scope

Add a player-facing objective summary to the main turn screen. Reuse existing goals, deadlines, appointments, and stage information; do not create a new objective system. Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Read:
- `AGENTS.md`
- `src/App.svelte`
- `src/ui/StatusBars.svelte`
- `src/ui/DeadlineBoard.svelte`
- `src/ui/AppointmentBar.svelte`
- `src/milestones/subgoals.ts`
- `src/deadlines/`
- `src/appointments/`
- `docs-dev/reference/primary_authoritative/specification.md` §3, §4.10, §4.11a

The player should immediately know what matters during the current turn.

## Required changes

1. Add a small “This term” panel near the top of the turn screen.
2. The panel should summarise:
   - the current stage goal;
   - the most urgent deadline or appointment, if any;
   - one short suggested focus based on current state.
3. The suggested focus must be simple and derived from existing state, for example:
   - high stress → recover;
   - no active research progress in research-career stages → work on research;
   - urgent deadline → go to the relevant location;
   - low standing → increase visibility/networking.
4. Keep the language dry, concise, and player-facing.
5. Make the panel purely advisory. It must not add mechanics or force choices.
6. If you discover that this prompt has been renumbered when added to the repository, keep the scope unchanged and use the actual prompt filename for the commit message.

## Do not implement

Do not implement:
- new win conditions;
- new deadline types;
- new appointment types;
- a tutorial system;
- pop-ups or modal interruptions.

## Acceptance criteria

The task is complete when:
- the turn screen clearly states what the player is trying to do now;
- the objective panel updates across stages and different pressure states;
- the panel does not duplicate the entire status display;
- `npm run check` passes.

## Checks

Run `npm run check`; run `npm run dev` and inspect at least two career stages or state conditions if feasible.

## Commit and push

If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename as the commit message, then push.

Do not create a branch. Do not open a pull request unless explicitly instructed.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
