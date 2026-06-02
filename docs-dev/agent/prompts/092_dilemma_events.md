# Task: Dilemma events with visible trade-offs

## Goal

Make event choices genuine dilemmas — every option has upsides and downsides, so
there is no obviously "correct" answer — and show each option's effect briefly,
under the option, before the player chooses.

## Scope

Add an effect preview under each choice in the event screen, and rebalance the
event content so choices trade off. Implement only what is described here.

## Context

Implements roadmap M17 (story/clarity). Specification §2, §4.2, §7. Depends on
`086`. Today choices apply effects but the player cannot see them until after
choosing, and several options are strictly better than their alternative.

## Required changes

1. Summarise a choice's effects as a short, readable line (signed deltas with
   friendly labels, e.g. "−12 Sleep · +2 Methods · +8 Stress"), generated from
   the choice's effects so it always matches what is applied.
2. Show that summary under each choice button in the event screen, before the
   choice is made.
3. Rebalance the authored events so each option carries both an upside and a
   downside (a real dilemma); no option should dominate its alternative.

## Do not implement

Do not:
- add branching/multi-step events or new effect keys beyond the existing map;
- change the turn, board, or appointment mechanics.

## Acceptance criteria

The task is complete when:
- each choice shows a brief effect summary beneath it before selection;
- options are dilemmas — both have pros and cons, no dominant choice;
- content loads and `npm run check` passes.

## Checks

Run `npm run check`; run `npm run dev` and confirm the previews and trade-offs
read clearly.

## Commit and push

Commit and push to `main` using this file's exact filename
(`092_dilemma_events.md`) as the commit message.

## Final report

End with the required final report specified in `AGENTS.md`.
