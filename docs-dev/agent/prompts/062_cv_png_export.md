# Task: Export the CV as a PNG

## Goal

Generate a client-side PNG of the CV for sharing.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M14. Specification §4.12. Depends on `060`.

## Required changes

1. Export the CV screen as a client-side PNG.

## Do not implement

Do not:
- implement shareable URLs (out of scope for beta unless requested, §4.12/§9);
- add a backend.

## Acceptance criteria

The task is complete when:
- a PNG of the CV downloads client-side;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`062_cv_png_export.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
