# Task: Wire the public-build safety check

## Goal

Wire the public-build safety check so `docs-dev/` and prompt files can never reach the build output.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M0. Specification §6 (no dev notes, prompt files, or secrets in the production bundle). Depends on `010`.

## Required changes

1. Ensure `scripts/check-public-build.sh` fails if `docs-dev/` or prompt files appear in `dist/`.
2. Add the check to the verify command (for example a `postbuild` or `check` step).

## Do not implement

Do not:
- add CI workflows (that is `012`);
- add deployment (that is `072`);
- implement game systems.

## Acceptance criteria

The task is complete when:
- building then running the check passes on a clean build;
- the check fails if a `docs-dev` file is copied into `dist/`.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`011_public_build_safety_check.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
