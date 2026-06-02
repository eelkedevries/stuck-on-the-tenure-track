# Task: Add lightweight in-world rival sightings

## Goal

Make rivals feel present in the world — seen in the seminar room, rumoured to
have published, spotted at a conference — extending the cohort-pressure system
rather than replacing the tracker.

## Scope

Lightweight rival presence surfaced through the board, events, and/or diary.
Reuse the existing rival simulation and cohort tracker. Implement only what is
described here.

## Context

Implements roadmap M17. Specification §4.9 (rivals/cohort). Depends on `046`
(rival simulation), `047` (cohort tracker), `078` (board), `081` (diary).

## Required changes

1. Generate occasional rival sightings tied to context — a rival seen at the
   seminar room or conference venue, rumoured to have published again, or
   mentioned in a café conversation — driven by the existing rival state.
2. Surface sightings lightly through the board, an event, or the diary; keep the
   separate cohort tracker as the full comparison view.
3. Keep it simple: no rival pathfinding or independent rival movement unless
   trivially derived from existing state.

## Do not implement

Do not:
- rebuild or replace the cohort tracker;
- add complex rival AI, pathfinding, or new rival systems;
- change the rival simulation model.

## Acceptance criteria

The task is complete when:
- rivals are occasionally surfaced in-world via sightings tied to context;
- the cohort tracker remains the full comparison view;
- `npm run check` passes.

## Checks

Run `npm run check`. Where visible, run `npm run dev` and confirm a rival
sighting can appear during play.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request.
If and only if the scope was followed and checks pass, create one commit on
`main` using this file's exact filename (`082_rival_sightings.md`) as the commit
message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
