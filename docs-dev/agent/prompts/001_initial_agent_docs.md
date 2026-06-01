# Task: Add initial agent workflow and reference documents

## Goal

Initialise the repository with the adapted `eek-a-dev` workflow and imported *Stuck on the Tenure Track* reference documents.

## Scope

Create only the documentation and agent-workflow files needed to make future implementation prompts safe and reviewable.

## Context

The source planning files came from a Google Drive folder containing `CLAUDE.md`, `overview.md`, and `specification.md`. The imported Drive workflow used direct commits to `main`; this prompt replaces that with the `eek-a-dev` prompt-branch workflow.

The target GitHub repository was effectively empty except for a one-line README, so this prompt is an initial repository-organisation step rather than a code implementation step.

## Required changes

1. Add project-level `AGENTS.md` with the prompt-based workflow.
2. Add a minimal `CLAUDE.md` wrapper that imports `AGENTS.md`.
3. Replace the one-line README with a public-facing project overview.
4. Add `docs-dev/` with reference, status, and prompt directories.
5. Add the adapted LLM reference and product overview under `docs-dev/reference/`.

## Do not implement

Do not implement:

- app source code;
- Svelte/Vite scaffolding;
- GitHub Pages deployment;
- CI workflows;
- gameplay systems.

## Acceptance criteria

The task is complete when:

- repository-level agent instructions exist;
- direct-to-`main` workflow rules have been removed from the active instructions;
- the reference document has the expected canonical filename;
- current repository status does not claim unverified implemented code;
- future work can proceed through numbered prompts.

## Checks

Manual documentation check only.

## Commit and push

If and only if the scope was followed, create one commit with the message `001_initial_agent_docs.md`, then push the branch `prompt/001-initial-agent-docs`.

Do not merge into `main`.

## Final report

End with the required final report specified in `AGENTS.md`.
