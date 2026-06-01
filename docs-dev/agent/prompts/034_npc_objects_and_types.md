# Task: Define NPC relationship objects

## Goal

Define NPC relationship objects.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M6. Specification §4.5 (relationships). Depends on `017`.

## Required changes

1. Define the NPC type with role, `relationship_score`, status, `last_interaction_turn`, `persistent`, `shared_papers`, and notes.

## Do not implement

Do not:
- implement decay (that is `035`);
- implement supervisor archetypes (that is `036`).

## Acceptance criteria

The task is complete when:
- the NPC type compiles with the specified fields;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`034_npc_objects_and_types.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
