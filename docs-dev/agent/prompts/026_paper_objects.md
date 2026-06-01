# Task: Define paper objects

## Goal

Define the first-class paper object type.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M4. Specification §4.3 (publication system). Depends on `017`.

## Required changes

1. Define the paper type with all specified fields (authors, journal tier, status, dates, citations history, methodology quality, misconduct flags, preregistered, open data, visibility).

## Do not implement

Do not:
- implement lifecycle transitions (that is `027`);
- implement citations (that is `029`).

## Acceptance criteria

The task is complete when:
- the paper type compiles with all specified fields;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`026_paper_objects.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
