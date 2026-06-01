# Task: Add the mobile location list

## Goal

Add the scrollable mobile location list.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M12. Specification §4.11 and §5. Depends on `050`.

## Required changes

1. Render a scrollable location list at mobile widths.

## Do not implement

Do not:
- implement the desktop map (that is `051`);
- implement the ghost penalty (that is `053`).

## Acceptance criteria

The task is complete when:
- the list renders and selects locations at mobile widths;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`052_location_list_mobile.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
