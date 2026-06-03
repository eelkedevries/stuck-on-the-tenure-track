# Task: Replace numeric action buttons with action cards

## Goal

Make board actions feel like concrete choices by replacing the `+10`, `+25`, and `All` controls with fixed-cost action cards.

## Scope

Change the player-facing board action UI and the activity metadata needed to support it. Keep the existing action categories and outcome system underneath. Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Read:
- `AGENTS.md`
- `src/ui/BoardScreen.svelte`
- `src/locations/stages.ts`
- `src/ui/game.svelte.ts`
- `src/engine/actions.ts`
- `docs-dev/reference/primary_authoritative/specification.md` §4.2, §4.11

The player should experience actions as concrete academic/life activities, not as manual allocation of abstract points.

## Required changes

1. Extend the activity model so each board activity can define:
   - a fixed time cost;
   - a short player-facing effect hint;
   - an optional one-line flavour result or tooltip.
2. Replace the `+10`, `+25`, and `All` buttons in `BoardScreen.svelte` with one button/card per available activity.
3. Each card must show:
   - activity name;
   - time cost;
   - short effect hint;
   - disabled state when insufficient time remains.
4. Keep each card mapped to the existing internal action category.
5. Use sensible default costs where existing activities do not define one.
6. Keep “Relax” as the simple way to spend the remaining time on recovery.
7. Make the cards concise and mobile-friendly.
8. If you discover that this prompt has been renumbered when added to the repository, keep the scope unchanged and use the actual prompt filename for the commit message.

## Do not implement

Do not implement:
- a new action category system;
- detailed previews of exact downstream equations;
- drag-and-drop allocation;
- multi-step action chains;
- changes to the outcome model beyond using the selected fixed cost.

## Acceptance criteria

The task is complete when:
- the board no longer exposes `+10`, `+25`, or `All` action-allocation buttons;
- actions are presented as fixed-cost cards;
- selecting an action spends the stated amount of time on the correct existing category;
- insufficient-time actions are disabled;
- `npm run check` passes.

## Checks

Run `npm run check`; run `npm run dev` and confirm that several actions can be selected, time decreases correctly, and the turn still ends when time runs out.

## Commit and push

If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename as the commit message, then push.

Do not create a branch. Do not open a pull request unless explicitly instructed.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
