# Task: Lead with story, tuck away the numbers

## Goal

Make the experience feel like a satirical story rather than a spreadsheet: the
narrative (events, diary, situation) leads, and raw stats are available but
secondary.

## Scope

Presentational reframing of the in-game screens. Implement only what is
described here; do not change mechanics.

## Context

Implements roadmap M17 (story-and-satire focus). Specification §5. Depends on
`081`, `085`, `086`. The board currently shows a dense resource readout up top.

## Required changes

1. Demote the raw resource readout to a clearly-labelled, collapsible or
   secondary "Your standing" area, so the board and its activities/events lead.
2. Give the in-game screens a consistent, readable narrative frame: a short
   situational line (where you are, what stage, what matters now) above the
   board, and keep the end-of-turn diary prominent.
3. Keep all information accessible and accessible-by-keyboard; only the emphasis
   changes.

## Do not implement

Do not:
- change turn, event, deadline, or outcome mechanics;
- remove any information the player needs — only re-rank its prominence.

## Acceptance criteria

The task is complete when:
- the narrative/situation leads and raw stats are present but secondary;
- nothing is removed and the screens remain keyboard-navigable;
- `npm run check` passes.

## Checks

Run `npm run check`; run `npm run dev` and confirm the story-forward feel.

## Commit and push

Always commit and push directly to `main` using this file's exact filename
(`087_narrative_framing.md`) as the commit message, then push `main`.

## Final report

End with the required final report specified in `AGENTS.md`.
