# Task: Simplify event effects to one upside and one downside

## Goal

Make event choices easy to read at a glance: each option usually has exactly one
positive and one negative effect (e.g. "Cram all night" → +knowledge, −sleep),
rather than a long list of small deltas.

## Scope

Rebalance the authored event choices. No engine or UI change is required (the
effect summary already renders whatever effects a choice has). Implement only
what is described here.

## Context

Implements roadmap M17 (clarity). Specification §2, §7. Depends on `086`, `092`.
Today many choices carry four or five effects, which clutters the preview.

## Required changes

1. Reduce every event choice to a clean trade-off: usually exactly one positive
   and one negative effect, occasionally a single minor effect where a dilemma
   does not warrant two. Keep the pairing thematic (the upside and downside
   should make sense for the choice).
2. Keep numbers modest and the two options genuinely trading off (no dominant
   option), across the psychology, core, and sub-discipline event packs.

## Do not implement

Do not:
- change the effect-summary UI or the effect keys;
- change turn, board, or appointment mechanics.

## Acceptance criteria

The task is complete when:
- each choice shows at most ~two effects, normally one positive and one negative;
- options remain genuine dilemmas;
- content loads and `npm run check` passes.

## Checks

Run `npm run check`; run `npm run dev` and confirm the previews are short and clear.

## Commit and push

Commit and push to `main` using this file's exact filename
(`093_simpler_effects.md`) as the commit message.

## Final report

End with the required final report specified in `AGENTS.md`.
