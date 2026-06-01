# Project agent instructions — Stuck on the Tenure Track

These instructions apply to all coding-agent work in this repository.

## 1. Project summary

*Stuck on the Tenure Track* is a turn-based, browser-based, single-player satirical simulation of an academic career, from undergraduate matriculation to the tenure decision. The player allocates limited time across research, teaching, service, funding, relationships, and health while competing against three AI rivals from the same cohort.

The beta covers psychology, with four sub-disciplines: cognitive, social, clinical, and developmental psychology.

## 2. Authoritative references

Read these before implementing project-specific work:

1. `docs-dev/reference/stuck-on-the-tenure-track-llm-reference.md` — design, scope, data models, and architecture.
2. `docs-dev/reference/development-status.md` — current repository state and known imported-document mismatches.
3. The active prompt file in `docs-dev/agent/prompts/`.

When these sources conflict, follow this order:

1. The active prompt for the current branch.
2. `docs-dev/reference/development-status.md` for repository reality.
3. `docs-dev/reference/stuck-on-the-tenure-track-llm-reference.md` for product/design intent.
4. This `AGENTS.md` for general workflow rules.

Do not assume implementation code exists because an older planning document says it does. Verify the repository state first.

## 3. Workflow rules

This repository uses the `eek-a-dev` prompt-based workflow adapted for a single public project repository.

- One numbered prompt equals one reviewable unit of work.
- Prompt files live in `docs-dev/agent/prompts/`.
- Prompt filenames use three-digit prefixes, for example `001_initial_agent_docs.md`.
- Run one prompt at a time.
- Create a branch named `prompt/NNN-short-name` before changing code.
- Implement only the active prompt.
- Do not implement adjacent systems or future prompts.
- Run the checks requested by the prompt.
- If the prompt succeeds, make exactly one commit with the exact prompt filename as the commit message.
- Push the prompt branch.
- Do not merge into `main`. Human review/merge is required.
- Do not commit partial or failed work unless explicitly instructed.

## 4. Repository layout

Use this structure unless a later prompt changes it deliberately:

```text
/
  README.md
  AGENTS.md
  CLAUDE.md
  docs-dev/                  # development-facing docs and prompt workflow material
    agent/prompts/           # numbered implementation prompts
    reference/               # design/reference docs
  docs/                      # public-facing usage/docs, if needed
  src/                       # application source, once implemented
  content/                   # YAML/JSON content packs, once implemented
  public/                    # static files served as-is
  .github/workflows/         # CI/deployment workflows, once implemented
```

This repository is public. `docs-dev/` is development-facing, not private. Do not put secrets, credentials, unreleasable private notes, customer data, or proprietary information anywhere in this repository.

## 5. Product and implementation constraints

Preserve these unless a prompt explicitly changes them:

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

At the end of each implementation prompt, assess whether `docs-dev/reference/development-status.md` needs a small update. Update it only when the change materially alters repository state, implemented systems, deployment state, or known limitations.

Do not rewrite the reference specification opportunistically. If a design conflict is found, propose the smallest correction in a dedicated prompt.

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
