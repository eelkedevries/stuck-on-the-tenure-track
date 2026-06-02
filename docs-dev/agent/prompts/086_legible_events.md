# Task: Legible, choice-driven, stage-appropriate events

## Goal

Turn events from opaque vignettes with a single "Acknowledge/Engage" button into
short situations with clear choices, each showing what happens, and make the
events that appear fit the player's career stage and sub-discipline.

## Scope

Extend the content-event schema and the event engine/UI, and author a coherent,
stage-appropriate event set with choices. Implement only what is described here.

## Context

Implements roadmap M17 (clarity, story-and-satire focus). Specification §2, §4.2,
§7. Depends on `076`, `066`, `067`–`070`, `085`. Today events have no choices,
are not gated by stage, and the selector pulls from every sub-discipline at once,
so a first-year undergraduate sees PhD/research events.

## Required changes

1. Extend the content event schema (`src/content/types.ts`, loader) with optional
   `choices`: each choice has a `label`, a one-line `result`, and light `effects`
   (a small map over wellbeing, standing, expertise, or funds). Keep events
   without choices working (a single acknowledge).
2. Support eligibility by career stage (`conditions.stages`) and restrict
   sub-discipline events to the player's committed sub-discipline (scope the
   event pool to core + discipline + the player's sub-discipline). An
   undeclared/early player sees only core and broad-psychology events.
3. Present choices in the event screen; applying a choice shows its `result` and
   applies its effects to game state. Effects are modest and readable.
4. Author a coherent, stage-tagged event set with choices: student events for
   undergraduate/MSc (study, exams, supervisor, social), and choices + stage
   tags on the broad-psychology and sub-discipline events so each stage gets
   fitting material. British English, dry, specific, non-moralising.

## Do not implement

Do not:
- build branching multi-step event chains or an effect scripting language
  beyond a flat effects map;
- add new action categories or new systems.

## Acceptance criteria

The task is complete when:
- events present clear choices with visible outcomes and apply light effects;
- the events shown fit the player's stage (a student sees student events) and
  sub-discipline;
- content loads and `npm run check` passes.

## Checks

Run `npm run check`; run `npm run dev` and confirm a student sees coherent events
with choices.

## Commit and push

Always commit and push directly to `main` using this file's exact filename
(`086_legible_events.md`) as the commit message, then push `main`.

## Final report

End with the required final report specified in `AGENTS.md`.
