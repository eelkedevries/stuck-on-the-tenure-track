# Stuck on the Tenure Track

*A satirical browser game about academic life.*

## What this is

*Stuck on the Tenure Track* is a turn-based simulation of an academic career, from undergraduate matriculation to the tenure decision. The player and three former high-school classmates pursue the same unrealistic goal: to be the first member of the cohort offered tenure.

The game is satire, but the mechanics are drawn from recognisable academic life: writing papers, surviving peer review, applying for grants, managing teaching and service, maintaining relationships, and dealing with the health costs of sustained overwork.

The beta scope is psychology, with four sub-disciplines: cognitive, social, clinical, and developmental psychology.

## Intended platform

The game is a browser-based static site for smartphone and desktop browsers. The beta has no backend, no accounts, and no runtime LLM dependency. Saves are local browser saves.

## Development workflow

This repository uses direct-to-`main` development.

- Work is committed directly to `main`.
- Do not create feature branches unless explicitly instructed.
- Do not open pull requests unless explicitly instructed.
- After every completed code or documentation adjustment, run the relevant checks, commit, and push to `main`.
- Keep commits atomic: one logical change per commit.

See `AGENTS.md` and `CLAUDE.md` for the active agent instructions.

## Reference documents

- `stuck-on-the-tenure-track-llm-reference.md` — canonical design and architecture reference.
- `stuck-on-the-tenure-track-overview.md` — shorter product overview.
- `docs-dev/development-status.md` — current repository status and known mismatches with earlier planning files.

## Public repository note

This repository is public. Do not commit secrets, credentials, private notes, customer material, or proprietary material.
