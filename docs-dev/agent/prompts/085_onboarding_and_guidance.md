# Task: Onboarding, objective, and per-screen guidance

## Goal

Make it obvious, from the first screen, who the player is, what the goal is, and
what to do each turn — so a newcomer can play without puzzling it out.

## Scope

Add an intro/onboarding step, a persistent objective line, and short guidance
captions on the in-game screens. Implement only what is described here.

## Context

Implements roadmap M17 (clarity). Specification §4.2, §5. Depends on `073`,
`078`, `081`. The game currently drops the player straight into an event list
with no framing.

## Required changes

1. Add an intro screen shown when starting a new game: in a few dry sentences,
   state the premise (a psychology student aiming to be first of their cohort to
   win tenure), how a turn works (respond to events, move around campus and
   spend your time, mind your deadlines, end the turn), and the goal. A "Begin"
   control starts the first turn.
2. Add a short, persistent objective line on the in-game board (e.g. "Be the
   first of your cohort to win tenure").
3. Add a one-line "what to do here" caption to the event screen and the board so
   each screen explains itself.

## Do not implement

Do not:
- change the event or turn mechanics (that is `086`);
- add a multi-step interactive tutorial or modal system.

## Acceptance criteria

The task is complete when:
- starting a new game shows the intro with the premise, the loop, and the goal,
  then begins play on Begin;
- the board shows the objective and each screen has a short guidance caption;
- `npm run check` passes.

## Checks

Run `npm run check`; run `npm run dev` and confirm the intro and captions read
clearly.

## Commit and push

Always commit and push directly to `main` using this file's exact filename
(`085_onboarding_and_guidance.md`) as the commit message, then push `main`.

## Final report

End with the required final report specified in `AGENTS.md`.
