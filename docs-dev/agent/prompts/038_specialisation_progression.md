# Task: Implement specialisation progression

## Goal

Implement progression undeclared → lean → commit → switch-at-cost.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M7. Specification §4.6. Depends on `037`.

## Required changes

1. Lean during MSc choice, commit at PhD supervisor selection, and allow switching later at significant cost.

## Do not implement

Do not:
- author sub-discipline content (milestone M15);
- implement supervisor archetypes (that is `036`).

## Acceptance criteria

The task is complete when:
- the player can progress through each state;
- switching after commitment applies a cost;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`038_specialisation_progression.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
