# Task: Make diary recaps more funny and consequential

## Goal

Make the end-of-turn diary recap the main satirical payoff by structuring it around concrete consequences, dry humour, rival movement, and visible progress changes.

## Scope

Improve the diary recap content and presentation. Reuse existing recap inputs and rival-sighting logic. Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Read:
- `AGENTS.md`
- `src/ui/recap.ts`
- `src/ui/DiaryScreen.svelte`
- `src/ui/game.svelte.ts`
- `src/rivals/sightings.ts`
- `docs-dev/reference/primary_authoritative/specification.md` §4.2, §4.9, §4.11, §7

The diary should function like the academic version of a board-game end-of-round summary: short, concrete, funny, and mechanically informative.

## Required changes

1. Revise recap generation so each recap attempts to include:
   - one concrete consequence of the player's time use;
   - one dry satirical line;
   - one rival/cohort line when available;
   - one visible progress or setback line.
2. Avoid long paragraphs. Prefer short lines that can be scanned quickly.
3. Make consequences readable without exposing too many raw numbers.
4. Ensure recaps reflect different play patterns, for example:
   - heavy lab/research focus;
   - overwork and high stress;
   - recovery/rest;
   - networking/visibility;
   - missed appointment;
   - deadline pressure.
5. Keep the existing diary screen structure unless a small presentation tweak is needed for readability.
6. If you discover that this prompt has been renumbered when added to the repository, keep the scope unchanged and use the actual prompt filename for the commit message.

## Do not implement

Do not implement:
- new turn mechanics;
- new rival mechanics;
- branching story arcs;
- long procedural prose;
- generated text from an LLM.

## Acceptance criteria

The task is complete when:
- end-of-turn recaps are shorter, funnier, and more informative;
- recaps visibly respond to player behaviour;
- rival sightings, when available, integrate naturally into the recap;
- `npm run check` passes.

## Checks

Run `npm run check`; run `npm run dev` and complete several turns with different action patterns to inspect recap variety.

## Commit and push

If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename as the commit message, then push.

Do not create a branch. Do not open a pull request unless explicitly instructed.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
