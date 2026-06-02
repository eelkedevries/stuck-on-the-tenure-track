# Task: Add the end-of-turn diary recap

## Goal

End each turn with a concise diary that makes cause and effect clear: where the
player went, what they did, what happened, and what changed.

## Scope

A recap screen/section built from data already produced during the turn. Reuse
`events_history` and turn deltas. Implement only what is described here.

## Context

Implements roadmap M17. Specification §4.2, §5. Depends on `076` (events_history),
`078` (board/movement), `079` (location memory). Optionally references `080`
deadlines if present.

## Required changes

1. Capture the turn's salient changes (movement, actions taken, events resolved,
   deadlines met/missed if present, and the main resource/health/relationship/
   rival deltas).
2. Render a concise, dry, British-English recap at turn end, in the game's tone,
   before the next turn begins.
3. Keep it data-driven from recorded state; do not hardcode narrative for
   specific situations beyond light templated phrasing.

## Do not implement

Do not:
- add new mechanics, deadlines, or rival logic (other prompts);
- write long narrative or per-event bespoke prose.

## Acceptance criteria

The task is complete when:
- committing a turn shows a recap summarising movement, actions, events, and key
  deltas for that turn;
- the recap is generated from recorded state;
- `npm run check` passes.

## Checks

Run `npm run check`. Where visible, run `npm run dev` and confirm the recap
appears at turn end and reflects what happened.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request.
If and only if the scope was followed and checks pass, create one commit on
`main` using this file's exact filename (`081_end_of_turn_diary.md`) as the
commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
