# Task: Implement relationship decay

## Goal

Implement per-role relationship decay when neglected.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M6. Specification §4.5. Depends on `034`.

## Required changes

1. Decay `relationship_score` when neglected, at role-specific rates; some relationships can end.

## Do not implement

Do not:
- implement supervisor archetypes (that is `036`);
- implement the CV costs list (that is `061`).

## Acceptance criteria

The task is complete when:
- neglected relationships decay and can reach an ended status;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`035_relationship_decay.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
