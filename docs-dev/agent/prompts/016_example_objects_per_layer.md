# Task: Add one example object per layer

## Goal

Add one example event at each layer to demonstrate inheritance and override.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M1. Specification §2 and §7 (content authoring rules). Depends on `015`.

## Required changes

1. Add a minimal example event in each of Layer 1, Layer 2, and Layer 3.
2. Use British English and the specification's tone.

## Do not implement

Do not:
- author the full content packs (milestone M15);
- add gameplay effects beyond what the loader needs.

## Acceptance criteria

The task is complete when:
- the three example events load;
- the Layer-3 example overrides the Layer-2 example when ids match;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`016_example_objects_per_layer.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
