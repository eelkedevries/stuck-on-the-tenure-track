# Task: Simulate rivals in parallel

## Goal

Run three scripted stochastic rivals in parallel during the rival phase.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M10. Specification §4.9. Depends on `045`, `025`.

## Required changes

1. Advance three rivals each turn using their archetype behaviour during the rival phase.

## Do not implement

Do not:
- reveal rivals' private state;
- implement the cohort tracker UI (that is `058`).

## Acceptance criteria

The task is complete when:
- three rivals progress each turn;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`046_rival_simulation.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
