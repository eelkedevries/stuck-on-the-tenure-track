# Task: Implement specialisation state

## Goal

Implement the specialisation state.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M7. Specification §4.6 (specialisation). Depends on `017`.

## Required changes

1. Track `status`, `current_sub_discipline`, and `commitment_turn`, defaulting to undeclared.

## Do not implement

Do not:
- implement progression transitions (that is `038`);
- author sub-discipline content (milestone M15).

## Acceptance criteria

The task is complete when:
- the specialisation state compiles and defaults to undeclared;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`037_specialisation_state.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
