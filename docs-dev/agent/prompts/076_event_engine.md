# Task: Add a minimal context-driven event engine

## Goal

Make events fire during a turn, selected by context, and surface them through
the existing event screen — replacing the stubbed event phase.

## Scope

Engine plus wiring to the existing `EventScreen`. Do not author new content or
build the board. Implement only the event selection/gating described here.

## Context

Implements roadmap M17. Specification §2 (content), §4.2 (turn loop, event
phase). Today `eventPhase` in `src/engine/turn.ts` is a stub and `events_history`
in the save schema is unused. Content events exist with tags. Depends on `014`,
`015`, `023`, `056`, `066`, `074`.

## Required changes

1. Add an event-selection module that, given the resolved content events and the
   current context (career stage, recently committed action categories, and
   event tags), chooses the turn's events (at least mandatory vs optional) and
   avoids repeats.
2. Replace the stubbed `eventPhase` so selected events are presented through the
   existing `EventScreen` and resolved choices are appended to `events_history`
   (the field already exists; no schema change).
3. Keep selection simple and data-driven (tag/stage matching); do not hardcode
   specific events in engine code.

## Do not implement

Do not:
- author new event content (use existing packs);
- bind events to board locations yet (that arrives with the board, `078`+);
- change the save schema.

## Acceptance criteria

The task is complete when:
- a turn surfaces context-appropriate events via the event screen;
- resolved events are recorded in `events_history`;
- selection is data-driven, not hardcoded;
- `npm run check` passes.

## Checks

Run `npm run check`. Where visible, run `npm run dev` and confirm events appear
and are recorded.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request.
If and only if the scope was followed and checks pass, create one commit on
`main` using this file's exact filename (`076_event_engine.md`) as the commit
message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
