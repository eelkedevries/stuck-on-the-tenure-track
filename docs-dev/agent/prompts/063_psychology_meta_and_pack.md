# Task: Add the psychology pack skeleton

## Goal

Add the Layer-2 psychology meta and pack skeleton.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M15. Specification §2 and §7. Depends on `015`.

## Required changes

1. Add `content/disciplines/psychology/meta.yaml` and the pack skeleton (authorship conventions, venue types, career-stage durations, and name-pool placeholders).

## Do not implement

Do not:
- author the sub-discipline packs (that is `067`–`070`);
- embed content in code.

## Acceptance criteria

The task is complete when:
- the psychology meta loads via the loader;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`063_psychology_meta_and_pack.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
