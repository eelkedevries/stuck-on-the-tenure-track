# Task: Add the CI workflow

## Goal

Add a GitHub Actions workflow that runs the build and safety checks on every push.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M0. Specification §6 (deployment discipline and CI). Depends on `010`, `011`.

## Required changes

1. Add a GitHub Actions workflow that runs `npm ci`, `npm run check`, `bash scripts/validate-prompts.sh`, the public-build check, and a secret scan on every push.

## Do not implement

Do not:
- add deployment or publishing steps (that is `072`);
- implement game systems.

## Acceptance criteria

The task is complete when:
- the workflow file exists and is valid YAML;
- it runs each listed step on push.

## Checks

Run `npm run check` and `bash scripts/validate-prompts.sh`, and confirm the workflow YAML is valid.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`012_ci_workflow.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
