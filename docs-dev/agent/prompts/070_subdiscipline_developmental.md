# Task: Author the developmental pack

## Goal

Author the developmental Layer-3 pack.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M15. Specification §2 and §7. Depends on `063`.

## Required changes

1. Author `content/disciplines/psychology/sub-disciplines/developmental/` with meta, journals, methods, event overrides/supplements, and figures.

## Do not implement

Do not:
- put broad-psychology events here;
- author other sub-disciplines.

## Acceptance criteria

The task is complete when:
- the developmental pack loads and overrides where ids match;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`070_subdiscipline_developmental.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
