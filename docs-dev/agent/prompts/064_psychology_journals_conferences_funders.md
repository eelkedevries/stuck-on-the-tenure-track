# Task: Author psychology venues and funders

## Goal

Author psychology journals, conferences, and funders.

## Scope

Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Implements roadmap M15. Specification §2, §4.4, and §7. Depends on `063`.

## Required changes

1. Author `journals.yaml`, `conferences.yaml`, and `funders.yaml` using real names where appropriate; funders include the ERC Starting Grant, NWO Veni, NWO Vidi, an NIH R01-equivalent, and smaller seed grants.
2. Use British English; avoid real living academics and defamatory institution-specific text.

## Do not implement

Do not:
- author sub-discipline content;
- add grant mechanics (that is `031`–`033`).

## Acceptance criteria

The task is complete when:
- the three files load and include the named funders;
- `npm run check` passes.

## Checks

Run `npm run check`. Where the change is visible in the UI, run `npm run dev` and confirm the observable outcome in the browser.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`064_psychology_journals_conferences_funders.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
