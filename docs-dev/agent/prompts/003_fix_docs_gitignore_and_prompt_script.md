# Task: Fix docs, gitignore, and prompt script

## Goal

Resolve the remaining small documentation and workflow-safety issues before app scaffolding begins.

## Scope

Implement only the cleanup items listed in this prompt. Do not scaffold the app, add CI, or implement gameplay.

## Context

External reviews and follow-up evaluation identified four immediate improvements that reduce risk for later prompt-driven implementation:

- the overview still described turns as fixed three-month academic terms, contradicting the binding specification;
- `.gitignore` was thinner than the `eek-a-dev` template and omitted protective public-repo ignores;
- `scripts/new-prompt.sh` lost the escaped quotes in its usage string;
- the review guide was under `docs-dev/agent/reviews/`, while the template convention places review material under `docs-dev/reviews/`.

## Required changes

1. Update `docs-dev/reference/secondary_background/overview.md` so the turn model matches the binding specification: approximately 25 abstract career turns with variable calendar duration across roughly 18 in-game years.
2. Update `docs-dev/planning/current_state.md` so it records that the turn-model wording is aligned in both the specification and overview.
3. Restore the template-style `.gitignore` protective entries for Python/cache/editor files and private/proprietary/customer development-material folders.
4. Fix the `scripts/new-prompt.sh` usage string so `"Task title"` is escaped inside the parameter-expansion error message.
5. Move the adapted review guide content to `docs-dev/reviews/code_review_guide.md` and update references in `AGENTS.md` and `docs-dev/agent/how_to_use.md`.
6. Replace live-looking example prompt numbers in `how_to_use.md` and `prompt_authoring_guide.md` with neutral `NNN` examples.
7. Add the pre-scaffold verify-command fallback note to `prompt_execution_guide.md`.

## Do not implement

Do not implement:

- Svelte/Vite scaffolding;
- app source code;
- GitHub Actions workflows;
- GitHub Pages deployment;
- gameplay logic;
- specification restructuring beyond the overview/current-state alignment described above.

## Acceptance criteria

The task is complete when:

- no secondary overview text describes turns as fixed three-month terms;
- `current_state.md` accurately records the turn-model alignment;
- `.gitignore` includes the protective ignores from the template;
- `new-prompt.sh` matches the template quoting for its usage string;
- review-guide references point to `docs-dev/reviews/code_review_guide.md`;
- prompt examples no longer reuse real queue numbers such as `002` or `003`;
- no app scaffold, CI workflow, or gameplay source code is added.

## Checks

Run:

```bash
bash -n scripts/*.sh
bash scripts/validate-prompts.sh
```

If these cannot be run in the current environment, perform manual documentation review and state that limitation in the final report.

## Commit and push

If and only if the scope was followed and checks pass or are explicitly unavailable, create one commit on `main` using this file's exact filename (`003_fix_docs_gitignore_and_prompt_script.md`) as the commit message, then push.

## Final report

End with the required final report specified in `AGENTS.md`.
