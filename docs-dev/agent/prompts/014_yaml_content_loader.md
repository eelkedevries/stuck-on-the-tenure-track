# Task: Add the YAML content loader

## Goal

Add a YAML content loader that reads content files into typed objects.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M1. Specification §2 (content layers). Depends on `013`.

## Required changes

1. Add a loader that parses YAML content files into the types from `013`.
2. Load the core layer at minimum.

## Do not implement

Do not:
- implement layer precedence or override (that is `015`);
- author real content.

## Acceptance criteria

The task is complete when:
- the loader reads a sample YAML file into a typed object;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`014_yaml_content_loader.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
