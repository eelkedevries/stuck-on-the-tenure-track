# Task: Vary the board by career stage

## Goal

Keep the same familiar board, but change the available actions and pressures by
career stage so the lab, office, classroom, etc. mean different things as a PhD,
a postdoc, and an assistant professor.

## Scope

Stage-conditioned location actions and pressures, data-driven where possible.
Implement only what is described here.

## Context

Implements roadmap M17 and completes the board redesign. Specification §3
(career stages), §4.11. Depends on `022` (stage budget), `078` (board), `075`
(action outcomes).

## Required changes

1. Make each location's available actions and emphasis vary by career stage —
   e.g. the lab is "run study" (PhD) → "analyse data / supervise RA" (postdoc) →
   "manage lab / chase ethics" (assistant professor); the funder portal moves
   from small grants to fellowships to ERC/NWO-style grants.
2. Prefer a data-driven mapping (stage × location → actions/pressures) over
   hardcoded conditionals; keep it readable.
3. Keep the locations themselves stable across stages; only actions and
   pressures change.

## Do not implement

Do not:
- add new locations or remove existing ones;
- add new systems or content packs beyond what the mapping needs;
- change the career arc or pacing.

## Acceptance criteria

The task is complete when:
- the same board offers stage-appropriate actions/pressures across at least the
  PhD, postdoc, and assistant-professor stages;
- the mapping is data-driven and readable;
- `npm run check` passes.

## Checks

Run `npm run check`. Where visible, run `npm run dev` and confirm a location
offers different actions at different stages.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request.
If and only if the scope was followed and checks pass, create one commit on
`main` using this file's exact filename (`083_stage_variation.md`) as the commit
message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
