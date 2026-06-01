# Task: Author broad-psychology events

## Goal

Author the Layer-2 broad-psychology events.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M15. Specification §2 and §7. Depends on `063`, `016`.

## Required changes

1. Author broad-psychology events in `events.yaml`: dry, specific, British English, and calendar- or stage-conditioned where relevant.

## Do not implement

Do not:
- author sub-discipline-only events (that is `067`–`070`);
- put cross-psychology events in a Layer-3 pack.

## Acceptance criteria

The task is complete when:
- the events load and are broad rather than sub-discipline-specific;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`066_psychology_events.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
