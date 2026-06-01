# Task: Add the costs list

## Goal

Add the secondary costs list to the CV screen.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M14. Specification §4.12. Depends on `060`, `040`, `035`.

## Required changes

1. Render the secondary costs list: relationships ended, hobbies abandoned, sick leave, chronic conditions, short-term cities, and sleep deficit.

## Do not implement

Do not:
- implement PNG export (that is `062`);
- make the costs editable.

## Acceptance criteria

The task is complete when:
- the costs list renders from recorded state;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`061_costs_list.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
