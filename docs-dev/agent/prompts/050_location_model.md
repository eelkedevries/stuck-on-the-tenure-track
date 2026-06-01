# Task: Model locations and bind actions

## Goal

Model locations and bind actions to them.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M12. Specification §4.11 (campus/map). Depends on `024`.

## Required changes

1. Model the locations (office, lab, library, classroom, seminar room, café/pub, home, conference venue, funder portal, gym/outdoors, GP/therapist/occupational health).
2. Bind actions to locations.

## Do not implement

Do not:
- implement the desktop map (that is `051`);
- implement the mobile list (that is `052`).

## Acceptance criteria

The task is complete when:
- actions are associated with locations;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`050_location_model.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
