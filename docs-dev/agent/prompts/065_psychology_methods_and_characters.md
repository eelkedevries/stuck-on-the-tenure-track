# Task: Author psychology methods and characters

## Goal

Author psychology methods, supervisor-archetype content, and name pools.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M15. Specification §2 and §7. Depends on `063`.

## Required changes

1. Author `methods.yaml`, the supervisor-archetype content, `characters.yaml`, and the name pools.

## Do not implement

Do not:
- author sub-discipline content;
- implement archetype mechanics (that is `036`).

## Acceptance criteria

The task is complete when:
- the files load and the supervisor archetypes match the six defined types;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`065_psychology_methods_and_characters.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
