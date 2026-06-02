# Task: Make the turn a spendable clock (remove "End turn")

## Goal

Remove the manual "End turn" button. The turn's time points become a clock the
player fills by moving and doing things; when the clock runs out, the turn
resolves automatically. A "relax / let time pass" action lets the player spend
the remainder deliberately.

## Scope

Turn-flow change in the store and board UI, plus the spec note for the
within-turn model. Implement only what is described here.

## Context

Implements roadmap M17 (clarity/feel). Specification §4.2, §4.11. Depends on
`078`, `085`. Today the player clicks "End turn"; the 100 time points are a
budget but not an explicit clock.

## Required changes

1. Treat the turn's time points as a within-turn clock: travel and activities
   draw it down, and when it reaches zero the turn resolves automatically (run
   the existing turn resolution).
2. Replace "End turn" with a **Relax / let time pass** action, available
   anywhere, that spends the remaining time as rest and ends the turn.
3. Update specification §4.2/§4.11 to describe the time points as the turn's
   clock (travel, activities, relaxing, and — later — appointments run on it;
   the turn auto-ends at zero); bump the spec version.

## Do not implement

Do not:
- add the progression bars (`089`), the square board (`090`), or appointments
  (`091`);
- change the turn's calendar duration.

## Acceptance criteria

The task is complete when:
- there is no "End turn" button; spending all time, or relaxing, ends the turn
  and resolves it;
- `npm run check` passes.

## Checks

Run `npm run check`; run `npm run dev` and confirm the turn ends by time, not a
button.

## Commit and push

Commit and push to `main` using this file's exact filename
(`088_time_driven_turn.md`) as the commit message.

## Final report

End with the required final report specified in `AGENTS.md`.
