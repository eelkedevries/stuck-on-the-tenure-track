# Stuck on the Tenure Track

*A satirical browser game about academic life.*

## What this is

*Stuck on the Tenure Track* is a turn-based simulation of an academic career, from undergraduate matriculation to the tenure decision. The player and three former high-school classmates pursue the same unrealistic goal: to be the first member of the cohort offered tenure.

The game is satire, but the mechanics are drawn from recognisable academic life: writing papers, surviving peer review, applying for grants, managing teaching and service, maintaining relationships, and dealing with the health costs of sustained overwork.

The beta scope is psychology, with four sub-disciplines: cognitive, social, clinical, and developmental psychology.

## Intended platform

The game is a browser-based static site for smartphone and desktop browsers. The beta has no backend, no accounts, and no runtime LLM dependency. Saves are local browser saves.

## Development workflow

This repository uses the `eek-a-dev` prompt-based workflow:

- one numbered prompt equals one reviewable unit of work;
- each implementation prompt runs on its own `prompt/NNN-short-name` branch;
- successful prompt runs produce one commit whose message is the prompt filename;
- agents do not merge their own work into `main`;
- human review/merge is the gate before proceeding.

See `AGENTS.md` and `docs-dev/agent/prompts/` for the active development workflow.

## Reference documents

- `docs-dev/reference/stuck-on-the-tenure-track-llm-reference.md` — project design and architecture reference.
- `docs-dev/reference/stuck-on-the-tenure-track-overview.md` — shorter product overview.
- `docs-dev/reference/development-status.md` — current repository status and known mismatches with imported planning files.

## Deployment note

This repository is currently public. Do not commit secrets, credentials, private notes, customer material, or proprietary material. Files under `docs-dev/` are development-facing, but because the repository is public they must still be safe to publish.
