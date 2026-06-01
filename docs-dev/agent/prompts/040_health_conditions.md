# Task: Implement health conditions

## Goal

Implement health conditions with severity, chronicity, and productivity penalties.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M8. Specification §4.7. Depends on `039`.

## Required changes

1. Implement conditions with type, severity, `onset_turn`, status, and `productivity_penalty`; some can become chronic.

## Do not implement

Do not:
- implement treatments (that is `041`);
- implement the CV costs list (that is `061`).

## Acceptance criteria

The task is complete when:
- a severe condition reduces effective productivity;
- some conditions persist as chronic;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`040_health_conditions.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
