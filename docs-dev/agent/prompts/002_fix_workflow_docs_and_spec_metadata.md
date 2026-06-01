# Task: Fix workflow docs and specification metadata

## Goal

Resolve documentation inconsistencies that affect the `eek-a-dev` workflow and clarify the specification before app scaffolding begins.

## Scope

Implement only documentation and workflow-guide corrections. Do not scaffold the app, add CI, or implement gameplay.

## Context

A repository audit found several fixes that clearly improve the repository now, without requiring the Svelte/Vite scaffold:

- the specification header still looked like an imported LLM reference rather than the binding specification;
- the turn-duration description conflicted with the 25-turn, 18-year stage table;
- `AGENTS.md` referred to a review guide that did not exist;
- the how-to guide implied CI already exists;
- the workflow rules did not clearly distinguish prompt-driven product work from explicit small documentation-maintenance requests;
- README did not mention local pre-commit hooks or licence status.

## Required changes

1. Update the specification title and metadata to identify it as the binding specification with version and last-updated fields.
2. Clarify the turn model so 25 turns across approximately 18 years is internally consistent.
3. Clarify in `AGENTS.md` and `how_to_use.md` that small explicit documentation/workflow maintenance requests may be implemented directly, while product/code work should normally use prompt files.
4. Add `docs-dev/agent/reviews/code_review_guide.md` and keep the supporting-guide reference valid.
5. Change CI wording in `how_to_use.md` to conditional language because CI has not yet been added.
6. Add README notes for optional `pre-commit install` and current licence status.
7. Update `docs-dev/planning/current_state.md` with the decisions made in this prompt.

## Do not implement

Do not implement:

- Svelte/Vite scaffolding;
- app source code;
- GitHub Actions workflows;
- GitHub Pages deployment;
- gameplay logic;
- enum/type/formula design beyond clarifying the turn-duration inconsistency.

## Acceptance criteria

The task is complete when:

- the specification has a clear `Version` and `Last updated` header;
- the turn-duration text no longer contradicts the stage table;
- no supporting-guide reference points to a missing review guide;
- the how-to guide no longer states that CI exists before it does;
- README includes local hook and licence-status notes;
- current state records these documentation corrections.

## Checks

Manual documentation check only. No app/build checks exist yet.

## Commit and push

If and only if the scope was followed, create one commit on `main` using this file's exact filename (`002_fix_workflow_docs_and_spec_metadata.md`) as the commit message, then push.

## Final report

End with the required final report specified in `AGENTS.md`.
