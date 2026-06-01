# Task: Implement supervisor archetypes

## Goal

Implement the six supervisor archetypes and their PhD-stage effects.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M6. Specification §4.5 (archetypes). Depends on `034`.

## Required changes

1. Implement supportive mentor, hands-off, micromanager, status-driven, absent, and exploitative, each affecting the PhD stage.

## Do not implement

Do not:
- author archetype flavour content (that is `065`);
- implement specialisation commitment (that is `038`).

## Acceptance criteria

The task is complete when:
- each archetype applies a distinct effect during the PhD stage;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`036_supervisor_archetypes.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
