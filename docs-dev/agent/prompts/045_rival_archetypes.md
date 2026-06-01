# Task: Define rival archetypes

## Goal

Define the four rival archetypes.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M10. Specification §4.9 (cohort tracker and AI rivals). Depends on `017`.

## Required changes

1. Define grinder, networker, gambler, and genuine scholar as scripted stochastic archetypes.

## Do not implement

Do not:
- implement parallel simulation (that is `046`);
- use any runtime LLM (out of scope, §9).

## Acceptance criteria

The task is complete when:
- the four archetypes are defined with distinct parameters;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`045_rival_archetypes.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
