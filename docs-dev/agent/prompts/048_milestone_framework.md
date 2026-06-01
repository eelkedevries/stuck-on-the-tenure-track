# Task: Implement the milestone framework

## Goal

Implement the four milestones as failable gates.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M11. Specification §4.10 (milestones and endings). Depends on `025`.

## Required changes

1. Implement MSc thesis defence, PhD dissertation defence, assistant professor appointment, and the tenure decision as milestones that can be failed, with consequences.

## Do not implement

Do not:
- implement the tenure decision logic (that is `049`);
- implement the CV screen (that is `060`).

## Acceptance criteria

The task is complete when:
- each milestone can pass or fail;
- failure has a consequence;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`048_milestone_framework.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
