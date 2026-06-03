# Task: Simplify the default HUD

## Goal

Make the main turn screen easier to read by showing a small set of headline tracks by default, while keeping detailed stats available in the existing collapsible standing section.

## Scope

Simplify the player-facing status display only. Keep the underlying state, resources, outcome calculations, and save schema intact. Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Read:
- `AGENTS.md`
- `src/App.svelte`
- `src/ui/StatusBars.svelte`
- `src/ui/TurnScreen.svelte`
- `src/state/types.ts`
- `docs-dev/reference/primary_authoritative/specification.md` §4.1, §4.7, §5

The game currently exposes several separate values on the main screen. The goal is to make the screen feel more like a board game than a simulation dashboard.

## Required changes

1. Redesign the default `StatusBars` display around four headline tracks:
   - **Career**: tenure/stage progress;
   - **Wellbeing**: stress, sleep, mood, and physical health collapsed into a readable summary;
   - **Skill**: derived from methods, theory, writing, statistics, and teaching;
   - **Standing**: derived from reputation, affiliation prestige, politics, and relevant public career signals.
2. `Skill` and `Standing` must be display-only derived summaries. Do not store them in save data and do not use them as new mechanics.
3. Keep the detailed raw numbers available only in the existing collapsible “Your standing (the numbers)” section.
4. Use plain labels and short captions. Do not require the player to understand internal variable names.
5. Preserve accessibility: values must remain readable as text and not rely on colour alone.
6. Do not change any mechanics. This is a display simplification.
7. If you discover that this prompt has been renumbered when added to the repository, keep the scope unchanged and use the actual prompt filename for the commit message.

## Do not implement

Do not implement:
- new resources;
- changes to outcome calculations;
- changes to save data;
- redesigns of the board, events, appointments, or diary.

## Acceptance criteria

The task is complete when:
- the main turn screen shows a concise four-track status summary;
- `Skill` and `Standing` are calculated for display only and are not persisted;
- detailed stats are still inspectable through the existing collapsible section;
- the game remains playable without exposing the full internal resource list by default;
- `npm run check` passes.

## Checks

Run `npm run check`; run `npm run dev` and manually confirm that the main turn screen is simpler and that the detailed numbers remain accessible.

## Commit and push

If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename as the commit message, then push.

Do not create a branch. Do not open a pull request unless explicitly instructed.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
