# Task: Create the content tree and types

## Goal

Create the content directory skeleton and JSON-serialisable types for layered content objects.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M1. Specification §2 (content architecture and recommended directory). Depends on `010`.

## Required changes

1. Create the `content/` tree per the recommended layout (core, psychology, sub-disciplines).
2. Define TypeScript types for content objects (events and pack metadata) that serialise to JSON without loss.

## Do not implement

Do not:
- implement the loader (that is `014`);
- author real discipline content (that is milestone M15);
- hardcode psychology content in code.

## Acceptance criteria

The task is complete when:
- the `content/` directories exist;
- `npm run check` type-checks the new types.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`013_content_dir_and_types.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
