# Project agent instructions — Stuck on the Tenure Track

These instructions apply to all coding-agent work in this repository.

## 1. Project summary

*Stuck on the Tenure Track* is a turn-based, browser-based, single-player satirical simulation of an academic career, from undergraduate matriculation to the tenure decision. The player allocates limited time across research, teaching, service, funding, relationships, and health while competing against three AI rivals from the same cohort.

The beta covers psychology, with four sub-disciplines: cognitive, social, clinical, and developmental psychology.

## 2. Authoritative references

Read these before implementing project-specific work:

1. `stuck-on-the-tenure-track-llm-reference.md` — canonical design, scope, data models, and architecture.
2. `docs-dev/development-status.md` — current repository state and known imported-document mismatches.
3. The active user request or prompt file, if one is being used.

When these sources conflict, follow this order:

1. The active user request.
2. The active prompt file, if one is being used.
3. `docs-dev/development-status.md` for repository reality.
4. `stuck-on-the-tenure-track-llm-reference.md` for product/design intent.
5. This `AGENTS.md` for general workflow rules.

Do not assume implementation code exists because an older planning document says it does. Verify the repository state first.

## 3. Workflow rules

This repository uses direct commits to `main`.

- Always commit and push directly to `main` after completed changes.
- Do not create feature branches unless explicitly instructed.
- Do not open pull requests unless explicitly instructed.
- Do not leave completed work only in a branch.
- Make atomic commits: one logical change per commit.
- Run relevant checks before committing.
- If checks cannot be run, state that clearly in the final report.
- Do not commit partial or failed work unless explicitly instructed.

If a numbered prompt file is used, treat one prompt as one logical unit of work, but still commit directly to `main`.

## 4. Repository layout

Use this structure unless a later instruction changes it deliberately:

```text
/
  README.md
  AGENTS.md
  CLAUDE.md
  stuck-on-the-tenure-track-llm-reference.md
  stuck-on-the-tenure-track-overview.md
  docs-dev/                  # development-facing docs and prompt material
    development-status.md
    prompts/                 # optional numbered implementation prompts
  docs/                      # public-facing usage/docs, if needed
  src/                       # application source, once implemented
  content/                   # YAML/JSON content packs, once implemented
  public/                    # static files served as-is
  .github/workflows/         # CI/deployment workflows, once implemented
```

This repository is public. Do not put secrets, credentials, unreleasable private notes, customer data, or proprietary information anywhere in this repository.

## 5. Product and implementation constraints

Preserve these unless explicitly changed:

- Browser-based static app.
- Mobile and desktop support.
- No backend for the beta.
- No runtime LLM for the beta.
- Local browser saves.
- Psychology beta only.
- British English throughout.
- Content lives in external content files rather than being hardcoded into the engine.
- Game state must serialise cleanly to JSON.

## 6. Coding conventions

- Prefer clarity over cleverness.
- Comment only non-obvious decisions.
- Keep TypeScript types aligned with the reference schemas once implementation begins.
- Use British spelling in code comments, documentation, and player-facing text.
- Keep player-facing satire dry, specific, and recognisable rather than broad or moralising.

## 7. Maintenance rules

At the end of each implementation round, assess whether `docs-dev/development-status.md` needs a small update. Update it only when the change materially alters repository state, implemented systems, deployment state, or known limitations.

Do not rewrite the reference specification opportunistically. If a design conflict is found, make the smallest necessary correction and document it clearly.

## 8. Required final report

Every agent run must end with this five-section report:

### 1. Work done

Use `Completed successfully`, `Partially completed`, or `Not completed`. State whether all stated acceptance criteria were met and whether the result was 100% successful.

### 2. Files changed

List every file added, modified, or deleted, with a one-line description. Write `None.` if no files were changed.

### 3. Scope deviations

List any work done that was not requested, with a brief reason. Write `None.` if scope was followed exactly.

### 4. Open issues

List issues or write `None.`

### 5. Human actions required

List required actions or write `None. You can proceed to the next prompt.`
