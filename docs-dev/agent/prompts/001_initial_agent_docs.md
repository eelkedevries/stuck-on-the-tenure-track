# Task: Add initial agent workflow and reference documents

## Goal

Initialise the repository with direct-to-`main` agent instructions and canonical *Stuck on the Tenure Track* reference structure.

## Scope

Create only the documentation and agent-workflow files needed to make future implementation work consistent.

## Context

The source planning files came from a Google Drive folder containing `CLAUDE.md`, `overview.md`, and `specification.md`. The canonical repository paths now follow `eek-a-dev`:

- `docs-dev/reference/primary_authoritative/specification.md`
- `docs-dev/reference/secondary_background/overview.md`
- `docs-dev/planning/current_state.md`
- `docs-dev/agent/prompts/`

The GitHub repository was effectively empty except for a one-line README, so this step is an initial repository-organisation step rather than a code implementation step.

## Required changes

1. Add project-level `AGENTS.md` with direct-to-`main` workflow rules.
2. Add a minimal `CLAUDE.md` wrapper that imports `AGENTS.md`.
3. Replace the one-line README with a public-facing project overview.
4. Add the canonical specification and product overview under `docs-dev/reference/`.
5. Add current-state notes under `docs-dev/planning/`.
6. Add the eek-a-dev agent guides and helper scripts.

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
- active instructions say to commit and push directly to `main`;
- reference filenames and paths are consistent with `eek-a-dev`;
- current repository status does not claim unverified implemented code;
- future work can proceed directly on `main` through `docs-dev/agent/prompts/`.

## Checks

Manual documentation check only.

## Commit and push

Commit directly to `main` with the message `001_initial_agent_docs.md`, then push `main`.

## Final report

End with the required final report specified in `AGENTS.md`.
