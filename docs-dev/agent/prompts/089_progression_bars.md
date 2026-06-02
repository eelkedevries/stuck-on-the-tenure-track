# Task: Live progression bars and a stress stat

## Goal

Show the things that matter as live bars rather than buried numbers, and add an
emotional-state (stress/anxiety) stat the player must manage by relaxing.

## Scope

Add a stress stat and a bars panel, and wire stress into the turn. Implement
only what is described here.

## Context

Implements roadmap M17 (feel). Specification §4.1, §4.7, §8. Depends on `039`
(wellbeing), `088`, `078`. The save schema's wellbeing is an object; adding a
field bumps the save version.

## Required changes

1. Add a `stress` value to the player's wellbeing (0–100): it rises with intense
   work (and missed appointments later), and falls when the player relaxes,
   rests, or exercises. High stress reduces productive yield and can trigger an
   anxiety condition; relaxing reduces it. Initialise it in a new game and bump
   `save_version`.
2. Add a progression-bars panel showing the main elements as labelled bars:
   stress, sleep, mood, physical, and tenure progress (a capped ratio of the
   tenure score to its threshold). Bars use text labels and values, not colour
   alone.
3. Surface the bars prominently on the board/turn view; keep the detailed
   numbers available (e.g. the existing "Your standing" disclosure).

## Do not implement

Do not:
- add the square board (`090`) or appointments (`091`);
- add new action categories.

## Acceptance criteria

The task is complete when:
- stress rises with work and falls when relaxing, with a visible effect at high
  levels;
- the bars panel shows stress, sleep, mood, physical, and tenure progress live;
- `npm run check` passes.

## Checks

Run `npm run check`; run `npm run dev` and confirm the bars update during play.

## Commit and push

Commit and push to `main` using this file's exact filename
(`089_progression_bars.md`) as the commit message.

## Final report

End with the required final report specified in `AGENTS.md`.
