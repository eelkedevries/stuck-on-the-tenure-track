# Task: Add the UI shell

## Goal

Add a mobile-first responsive pixel-art UI shell.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M13. Specification §5 (UI and platform requirements). Depends on `010`.

## Required changes

1. Add a responsive, mobile-first pixel-art shell with adequate contrast, text labels for colour-coded information, browser zoom support, and keyboard navigability.

## Do not implement

Do not:
- implement specific screens (that is `055`–`059`);
- implement gameplay.

## Acceptance criteria

The task is complete when:
- the shell renders responsively at mobile and desktop widths;
- basic keyboard navigation works;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`054_ui_shell.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
