# Task: Reduce visible misconduct in the default board loop

## Goal

Keep misconduct as an internal/risky system, but stop presenting it as a routine default board action unless it appears in a specific contextual event or clearly risky action.

## Scope

Adjust player-facing visibility of misconduct actions. Preserve the existing misconduct system and paper-level misconduct tracking. Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Read:
- `AGENTS.md`
- `src/locations/types.ts`
- `src/locations/stages.ts`
- `src/papers/misconduct.ts`
- `src/papers/detection.ts`
- `src/ui/BoardScreen.svelte`
- `content/`
- `docs-dev/reference/primary_authoritative/specification.md` §4.8, §7

Misconduct should be a risky satirical pressure, not a normal activity listed beside studying, writing, teaching, or resting.

## Required changes

1. Remove generic/default “Cut corners” misconduct actions from routine board activity fallbacks where they appear as ordinary activities.
2. Preserve the internal `misconduct` action category and existing misconduct modules.
3. If misconduct remains visible anywhere, make it clearly contextual and risky, with explicit wording that it is cutting corners.
4. Prefer surfacing misconduct through rare events or explicit authored choices rather than as a standard location action.
5. Ensure this change does not break type checks or action handling.
6. If you discover that this prompt has been renumbered when added to the repository, keep the scope unchanged and use the actual prompt filename for the commit message.

## Do not implement

Do not implement:
- new misconduct mechanics;
- new detection algorithms;
- moralising text;
- removal of the misconduct system;
- additional event packs unless a small existing event edit is needed.

## Acceptance criteria

The task is complete when:
- misconduct is no longer presented as a routine default board activity;
- existing misconduct code remains intact;
- any remaining player-facing misconduct option is clearly framed as risky and contextual;
- `npm run check` passes.

## Checks

Run `npm run check`; run `npm run dev` and inspect board activities across several locations/stages to confirm misconduct is not routinely exposed.

## Commit and push

If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename as the commit message, then push.

Do not create a branch. Do not open a pull request unless explicitly instructed.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
