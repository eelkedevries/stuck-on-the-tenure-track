# Task: Show rival headlines on the main turn screen

## Goal

Make the cohort competition more visible by showing one concise rival headline during the main turn, while keeping the full cohort tracker as the detailed view.

## Scope

Add lightweight rival visibility to the main turn screen. Reuse existing rival state and cohort logic. Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Read:
- `AGENTS.md`
- `src/App.svelte`
- `src/rivals/cohort.ts`
- `src/rivals/sightings.ts`
- `src/rivals/simulation.ts`
- `src/ui/CohortScreen.svelte`
- `docs-dev/reference/primary_authoritative/specification.md` §4.9, §4.11

The rivals should feel present in the world, not hidden behind a separate tracker screen.

## Required changes

1. Add a compact rival headline component or helper that selects one readable rival update from existing rival state.
2. Show the headline on the main turn screen near the objective/status area.
3. The headline should be dry, specific, and short.
4. The headline should not reveal hidden private rival information such as wellbeing or misconduct.
5. Keep the existing Cohort screen as the full comparison view.
6. Ensure the headline changes plausibly over the game but does not require new rival mechanics.
7. If you discover that this prompt has been renumbered when added to the repository, keep the scope unchanged and use the actual prompt filename for the commit message.

## Do not implement

Do not implement:
- rival dialogue trees;
- direct rival interaction mechanics;
- new hidden rival state;
- cheating/misconduct revelations unless already public;
- multiplayer.

## Acceptance criteria

The task is complete when:
- the main turn screen shows one rival/cohort headline;
- the headline uses only public rival information;
- the full Cohort screen still works;
- `npm run check` passes.

## Checks

Run `npm run check`; run `npm run dev` and confirm that a rival headline appears during a turn and that the Cohort screen remains accessible.

## Commit and push

If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename as the commit message, then push.

Do not create a branch. Do not open a pull request unless explicitly instructed.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
