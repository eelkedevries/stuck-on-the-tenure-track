# Current state

Last updated: 2026-06-01.

## Repository state

The repository has been initialised with documentation, agent workflow guides, prompt scaffolding, helper scripts, review guidance, and reference documents. The Svelte 5 + TypeScript + Vite scaffold now exists (`010_scaffold_svelte_vite.md`): `npm run check` type-checks and builds, `npm run dev` serves under the base path `/stuck-on-the-tenure-track/`, and the lockfile is committed. A public-build safety check runs after every build (`011`) and a CI workflow runs build and safety checks on push (`012`). The `content/` directory tree and JSON-serialisable content types (`src/content/types.ts`) exist (`013`), and a YAML content loader (`src/content/loader.ts`, using `js-yaml`) parses pack documents into typed objects and loads the core layer (`014`); the three-layer override resolver (`src/content/inheritance.ts`) applies sub-discipline → discipline → core precedence by `event_id` (`015`); and example events at each layer plus `loadAllPacks()` demonstrate loading and override (`016`). Milestone M1 (content architecture) is complete. Resource and game-state types (`src/state/types.ts`) exist, JSON-serialisable with the h-index derived rather than stored (`017`); the save-schema types (`src/state/save.ts`: `SaveGame`, `SavePlayer`, `Calendar`, `Settings`) match specification §8 (`018`); lossless `serialise`/`deserialise` (`src/state/serialise.ts`, `019`) and single-slot local-storage save/load/reset (`src/state/storage.ts`, `020`) are implemented — milestone M2 (state and saves) is complete. Milestone M3 (calendar and turn engine) is complete: the calendar model (`src/calendar/calendar.ts`, `021`), the ~25-turn career-stage budget (`src/calendar/stages.ts`, `022`), the 7-phase turn loop (`src/engine/turn.ts`, `023`), the 100-time-point action allocation with seven categories (`src/engine/actions.ts`, `024`), and the resolution phase that applies action effects and runs milestone/game-end checks (`src/engine/resolution.ts`, `025`). Publications (M4) are under way: paper objects (`src/papers/types.ts`, `026`), lifecycle transitions (`src/papers/lifecycle.ts`, `027`), and authorship weighting (`src/papers/authorship.ts`, `028`). Citation dynamics, the h-index, other game systems, UI, tests, and a deployment workflow have not been implemented yet.

## Active workflow

The repository follows the `eek-a-dev` commit-to-`main` workflow:

- one prompt equals one reviewable unit of work;
- prompt files live in `docs-dev/agent/prompts/`;
- prompt work is committed directly to `main` with the exact prompt filename as the commit message;
- no feature branches or pull requests unless explicitly requested;
- non-prompt commits use a conventional prefix such as `docs:`, `fix:`, or `feat:`.

Small explicit documentation or workflow-maintenance requests may be implemented directly. Product and code changes should normally be captured as numbered prompt files before execution.

## Canonical documents

- Binding specification: `docs-dev/reference/primary_authoritative/specification.md`
- Non-binding overview: `docs-dev/reference/secondary_background/overview.md`
- Living progress/state note: `docs-dev/planning/current_state.md`

## Documentation corrections completed

- `docs-dev/reference/primary_authoritative/specification.md` has explicit `Version` and `Last updated` metadata.
- The turn model is now aligned in both the binding specification and the non-binding overview: a turn is an abstract career turn with variable calendar duration, not a fixed three-month term.
- `docs-dev/reviews/code_review_guide.md` contains the manual post-commit review checklist.
- `docs-dev/agent/how_to_use.md` describes CI as future/conditional rather than already present.
- `README.md` notes optional pre-commit hook installation and the current no-licence/all-rights-reserved status.
- `.gitignore` includes template-style protective ignores for private/proprietary/customer development material, Python cache files, coverage, and editor folders.
- `scripts/new-prompt.sh` has the template-style escaped usage string.

## Imported planning-file mismatch

The original Drive `CLAUDE.md` source file recorded that a Svelte 5 + TypeScript + Vite framework layer had already been implemented and tested elsewhere. That claim is not true of this GitHub repository at the time of this import. Treat it as historical planning context, not as current repository state.

## Public repository note

This repository is public. Do not commit secrets, credentials, private planning notes, customer information, proprietary material, or anything unsuitable for public repository history.

## Prompt-generation layer

Two meta-prompts now plan the build-prompt queue before any code is written:

- `004_author_build_roadmap.md` — produces `docs-dev/planning/build_roadmap.md`, a dependency-ordered, milestone-grouped list of every build prompt (one row each), numbered from `010`. This is the planning gate.
- `005_author_build_prompt_files.md` — authors the actual numbered build-prompt files from that roadmap, each conforming to `prompt_authoring_guide.md`.

Both are tool-agnostic (Claude Code and ChatGPT Codex), reference the specification by section rather than inlining it, and keep each planned prompt to one narrow reviewable unit.

## Build roadmap

`docs-dev/planning/build_roadmap.md` now exists. It is the dependency-ordered queue of build prompts (`010`–`072`) grouped into milestones M0–M16, covering every specification system and nothing in specification section 9. It is the source of truth for build-prompt numbering and ordering. Discipline-specific content is centralised in the M15 content packs rather than embedded in engine prompts.

## Build-prompt queue

The build-prompt files `010`–`072` (63 prompts across milestones M0–M16) now exist in `docs-dev/agent/prompts/`, authored from `build_roadmap.md`. Each follows the required prompt structure, references its specification section(s), names its dependencies, and commits directly to `main`. No application or content code has been written yet.

## Recommended next prompt

Execute the build prompts in order, starting with `010_scaffold_svelte_vite.md` (the Svelte 5 + TypeScript + Vite scaffold). Deployment (`072`) comes last. Run one prompt per session per `prompt_execution_guide.md`.
