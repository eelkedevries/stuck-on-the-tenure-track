# Task: Playthrough tune the simplified board-game loop

## Goal

Tune the simplified player-facing loop so the first several turns are understandable, quick, and enjoyable without requiring the player to inspect raw numbers.

## Scope

Make small tuning and copy changes only after prompts `098`–`104` are complete. This is a polish pass, not a new-system prompt. Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Read:
- `AGENTS.md`
- `src/App.svelte`
- `src/ui/StatusBars.svelte`
- `src/ui/BoardScreen.svelte`
- `src/ui/recap.ts`
- `src/locations/stages.ts`
- `content/disciplines/psychology/events.yaml`
- `docs-dev/reference/primary_authoritative/specification.md`
- `docs-dev/planning/current_state.md`

The goal is to evaluate the visible loop as a player would experience it.

## Required changes

1. Run the app and play through at least the first three turns from a new game.
2. Identify friction points where the player may not understand:
   - what to do next;
   - why an action matters;
   - what changed after a turn;
   - how rivals are doing;
   - how wellbeing/stress affects the career.
3. Make only small copy, ordering, spacing, label, and tuning changes needed to improve clarity and fun.
4. Prefer removing clutter over adding more information.
5. If the playthrough reveals changes larger than small copy, ordering, spacing, label, or tuning edits, stop and propose follow-up prompts instead of implementing them.
6. Update `docs-dev/planning/current_state.md` with a concise note that the simplification/fun-factor pass is complete, if the pass succeeds.
7. If you discover that this prompt has been renumbered when added to the repository, keep the scope unchanged and use the actual prompt filename for the commit message.

## Do not implement

Do not implement:
- new game systems;
- new resources;
- new screens;
- new content packs;
- major visual redesign;
- changes that require reworking the underlying simulation.

## Acceptance criteria

The task is complete when:
- the first several turns are understandable without opening the raw-number section;
- the board loop feels like choosing concrete actions under time pressure;
- the end-of-turn recap clearly explains what happened;
- rival information is visible without needing to open the full cohort screen;
- no large unplanned changes were implemented;
- `npm run check` passes.

## Checks

Run `npm run check`; run `npm run dev` and manually play at least three turns from a new game. Include the manual playthrough observations in the final report.

## Commit and push

If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename as the commit message, then push.

Do not create a branch. Do not open a pull request unless explicitly instructed.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
