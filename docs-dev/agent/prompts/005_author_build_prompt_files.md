# Task: Author the build-prompt files from the roadmap

## Goal

Author every numbered build-prompt file listed in the approved build roadmap, each conforming exactly to the project's prompt structure, without writing any application or content code.

## Scope

Implement only the authoring of build-prompt files under `docs-dev/agent/prompts/`, derived from `docs-dev/planning/build_roadmap.md`. Do not scaffold the app, write game logic, or create `content/` data.

## Context

This is the second meta-prompt. Prompt `004` produced the roadmap; this prompt turns each roadmap row into a real, executable build-prompt file so a coding agent can later run them one at a time per `docs-dev/agent/prompt_execution_guide.md`.

Authoritative inputs, in precedence order:

- `docs-dev/planning/build_roadmap.md` (the queue to realise — filenames, goals, dependencies, spec sections);
- `docs-dev/reference/primary_authoritative/specification.md` (binding ground truth — never contradict);
- `docs-dev/agent/prompt_authoring_guide.md` (the exact required structure).

Operating principles (these make the project's four goals checkable):

1. **Optimised for Claude Code and ChatGPT Codex.** Tool-agnostic Markdown, exact paths, only this repo's own scripts; no agent-specific syntax.
2. **Best possible output.** Each file is one narrow, independently reviewable unit with observable acceptance criteria, traceable to its roadmap row and spec section.
3. **Spec-aligned.** Realise exactly the roadmap; do not add, drop, or reorder prompts. If a roadmap row conflicts with the specification, stop and flag it rather than inventing a fix.
4. **Token-efficient.** Reference spec sections by number; never copy spec prose into a prompt. Keep each file as short as its structure allows.

## Required changes

1. For every row in `docs-dev/planning/build_roadmap.md`, create the corresponding `docs-dev/agent/prompts/NNN_*.md` file using the exact filename from the roadmap.
2. Structure each file exactly per `prompt_authoring_guide.md`, with these sections in order: `# Task:` title, `## Goal`, `## Scope`, `## Context`, `## Required changes`, `## Do not implement`, `## Acceptance criteria`, `## Checks`, `## Commit and push`, `## Final report`.
3. In each file's `## Context`, reference only the specific specification section(s) named in the roadmap row and any prompts it depends on. Do not inline spec prose.
4. Make `## Required changes` concrete and minimal, and `## Acceptance criteria` observable (what can be seen, run, or measured) rather than only "checks pass".
5. In `## Do not implement`, list the adjacent systems and future prompts most likely to be over-reached for that specific task.
6. In each `## Checks`, use the project verify command `npm run check` once the scaffold exists; for any prompt that runs before the scaffold, fall back to the checks named in `prompt_execution_guide.md` (for example `bash scripts/validate-prompts.sh`).
7. In each `## Commit and push`, instruct: commit on `main` using that file's exact filename as the commit message, only if scope was followed and checks pass.
8. End each file's `## Final report` section by pointing to the report defined in `AGENTS.md`.
9. Use British English throughout.

## Do not implement

You author prompt files that *describe* scaffold, CI, and deployment work; you must not implement or configure any of it yourself. Specifically, do not:
- create, reorder, renumber, or rename prompts beyond what the roadmap specifies;
- scaffold Svelte/Vite or write any application or content code;
- create, configure, or edit CI, deployment, or GitHub Pages files yourself;
- execute any of the build prompts you author;
- contradict or restructure the specification.

## Acceptance criteria

The task is complete when:
- exactly one prompt file exists for each row in `build_roadmap.md`, with matching filenames, and no extra or missing files;
- every authored file contains all required sections in the order above;
- every file's `## Context` references its roadmap spec section(s) by number and inlines no spec prose;
- no authored prompt targets a feature listed in specification section 9;
- `bash scripts/validate-prompts.sh` passes;
- no application or content code has been created.

## Checks

Run:

```bash
bash scripts/validate-prompts.sh
```

Then manually confirm one authored file per roadmap row and that each matches the required structure. State any limitation in the final report.

## Commit and push

If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`005_author_build_prompt_files.md`) as the commit message, then push.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
