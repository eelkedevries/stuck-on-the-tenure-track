# Task: Track misconduct per paper

## Goal

Track grey-area and outright misconduct per paper, attributed to an author.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M9. Specification §4.8 (misconduct system). Depends on `026`.

## Required changes

1. Track grey-area practices (HARKing, selective reporting, p-hacking, gift authorship, salami-slicing, citation gaming) and outright misconduct (fabrication, falsification, plagiarism) per paper, attributed to an author.

## Do not implement

Do not:
- implement detection (that is `044`);
- add a global player misconduct flag.

## Acceptance criteria

The task is complete when:
- misconduct is recorded on the paper, not the player;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`043_misconduct_per_paper.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
