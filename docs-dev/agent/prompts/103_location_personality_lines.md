# Task: Add location personality lines

## Goal

Make the campus board feel more alive by giving each location a short recurring personality line or voice without adding new mechanics.

## Scope

Add lightweight location flavour to the board. Keep all gameplay effects unchanged. Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Read:
- `AGENTS.md`
- `src/locations/types.ts`
- `src/locations/stages.ts`
- `src/ui/BoardScreen.svelte`
- `src/ui/CampusMap.svelte`
- `docs-dev/reference/primary_authoritative/specification.md` §4.11, §7

Locations should feel like recognisable academic-life spaces, not generic action containers.

## Required changes

1. Add short flavour/personality text for each board location.
2. Where useful, allow stage-specific flavour lines, but keep this simple.
3. Show the current location's personality line on the board near the location focus text.
4. Use dry, specific academic satire. Examples of tone:
   - the funder portal should feel bureaucratic and prestige-obsessed;
   - the café/pub should feel like informal politics;
   - home should feel like recovery mixed with guilt;
   - the ethics/health location should feel procedural but useful.
5. Keep lines concise enough for mobile.
6. If you discover that this prompt has been renumbered when added to the repository, keep the scope unchanged and use the actual prompt filename for the commit message.

## Do not implement

Do not implement:
- NPC dialogue systems;
- new events;
- new mechanics;
- long location descriptions;
- real living academics or defamatory institution-specific jokes.

## Acceptance criteria

The task is complete when:
- every board location has a visible short personality/flavour line;
- the line changes appropriately by location;
- the board remains compact and readable on mobile;
- `npm run check` passes.

## Checks

Run `npm run check`; run `npm run dev` and visit multiple locations on the board to confirm the lines display correctly.

## Commit and push

If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename as the commit message, then push.

Do not create a branch. Do not open a pull request unless explicitly instructed.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
