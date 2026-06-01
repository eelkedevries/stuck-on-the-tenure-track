# Stuck on the Tenure Track

*A satirical browser game about academic life.*

## What this is

*Stuck on the Tenure Track* is a turn-based simulation of an academic career, from undergraduate matriculation to the tenure decision. The player and three former high-school classmates pursue the same unrealistic goal: to be the first member of the cohort offered tenure.

The game is satire, but the mechanics are drawn from recognisable academic life: writing papers, surviving peer review, applying for grants, managing teaching and service, maintaining relationships, and dealing with the health costs of sustained overwork.

The beta scope is psychology, with four sub-disciplines: cognitive, social, clinical, and developmental psychology.

## Intended platform

The game is a browser-based static site for smartphone and desktop browsers. The beta has no backend, no accounts, and no runtime LLM dependency. Saves are local browser saves.

## Development workflow

This repository follows the `eek-a-dev` commit-to-`main` workflow:

- one prompt equals one reviewable unit of work;
- prompt files live in `docs-dev/agent/prompts/`;
- prompt work is committed directly to `main` using the exact prompt filename as the commit message;
- do not create feature branches or pull requests unless explicitly instructed;
- run the project verify command and prompt checks before committing.

Start with `docs-dev/agent/how_to_use.md` for the daily workflow.

## Reference documents

- `docs-dev/reference/primary_authoritative/specification.md` — binding design and architecture reference.
- `docs-dev/reference/secondary_background/overview.md` — non-binding product overview.
- `docs-dev/planning/current_state.md` — current repository state and implemented progress.

## Public repository note

This repository is public. Do not commit secrets, credentials, private notes, customer material, or proprietary material.
