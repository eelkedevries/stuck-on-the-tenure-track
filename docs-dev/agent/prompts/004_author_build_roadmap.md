# Task: Author the build-prompt roadmap

## Goal

Produce a single dependency-ordered roadmap that lists every build prompt required to implement the game described in the specification, one line per prompt, without writing any build prompts or application code yet.

## Scope

Implement only the roadmap document described below. Do not author the individual build-prompt files (that is prompt `005`), do not scaffold the app, and do not write any application or content code.

## Context

This prompt is the planning gate for prompt-driven construction of *Stuck on the Tenure Track*. It turns the binding specification into an explicit, reviewable work queue so that prompt `005` can author each build prompt mechanically.

Authoritative inputs, in precedence order:

- `docs-dev/reference/primary_authoritative/specification.md` (binding ground truth — never contradict it);
- `docs-dev/agent/prompt_authoring_guide.md` (the shape every build prompt must take);
- `docs-dev/planning/current_state.md` (what already exists).

Operating principles for this prompt — these also bind the build prompts you plan:

1. **Optimised for Claude Code and ChatGPT Codex.** Keep everything tool-agnostic: plain Markdown, exact file paths, no agent-specific commands beyond this repo's own scripts.
2. **Best possible output.** Every planned prompt must be narrow, independently reviewable, and traceable to a specification section.
3. **Spec-aligned.** Cover every system in the specification and nothing out of scope (see specification section 9).
4. **Token-efficient.** Reference spec sections by number; never plan to copy spec prose into prompts. Order prompts so each depends only on already-completed work, so the executing agent never re-derives earlier decisions.

## Required changes

1. Create `docs-dev/planning/build_roadmap.md`.
2. Open it with a short purpose paragraph and a "How to use" note stating: prompts are authored by prompt `005`, executed one at a time per `docs-dev/agent/prompt_execution_guide.md`, and that the roadmap is the source of truth for build-prompt numbering and ordering.
3. Group the build prompts into ordered milestones. Use the following milestone decomposition as the baseline, adjusting only where the specification requires it, and record any adjustment in a short "Deviations from baseline" note:

   | Milestone | Covers | Spec sections |
   |---|---|---|
   | M0 Foundations | Svelte 5 + TS + Vite scaffold, `npm run check`, CI, GitHub Pages base path `/stuck-on-the-tenure-track/`, public-build safety wiring | 1.3, 5, 6 |
   | M1 Content architecture | `content/` tree, YAML loader, 3-layer inheritance (L3→L2→L1), JSON-serialisable types, one example object per layer | 2, 7 |
   | M2 State and saves | resources, game-state object, save schema types, JSON serialise/deserialise, local-storage save/load/reset | 4.1, 8 |
   | M3 Calendar and turn engine | calendar model, stage turn budget, 7-phase turn loop, 100 TP budget, action categories | 3, 4.2 |
   | M4 Publications | paper objects, lifecycle, authorship weighting, citation dynamics, computed h-index | 4.3 |
   | M5 Grants | grant objects, calendar-bound calls, success model, beta grant set | 4.4 |
   | M6 Relationships | NPC objects, per-role decay, supervisor archetypes | 4.5 |
   | M7 Specialisation | undeclared → lean → commit → switch-at-cost | 4.6 |
   | M8 Health and imposter | sleep/mood/physical, conditions, treatments, imposter subsystem | 4.7 |
   | M9 Misconduct | per-paper tracking, grey/outright practices, detection model with non-positive EV | 4.8 |
   | M10 Cohort and rivals | three scripted stochastic archetypes, public-only tracker | 4.9 |
   | M11 Milestones and endings | four milestones, tenure decision logic, win condition | 4.10 |
   | M12 Campus and locations | desktop pixel map, mobile location list, ghost penalty | 4.11 |
   | M13 UI framework and screens | mobile-first responsive pixel-art shell, turn/event/action/cohort screens | 5 |
   | M14 End-game CV | CV screen, costs list, client-side PNG export | 4.12 |
   | M15 Content packs | psychology L2 pack and cognitive/social/clinical/developmental L3 packs | 2, 7 |
   | M16 Polish and deploy | bundle <5 MB, TTI <3 s, turn <1 s, deployment workflow | 5, 6 |

4. Under each milestone, list its build prompts as a Markdown table with columns: `Prompt file` (e.g. `010_scaffold_svelte_vite.md`), `One-sentence goal`, `Depends on` (prompt numbers or `—`), `Spec section`.
5. Number build prompts sequentially starting at `010`, so they never collide with meta-prompts `004`–`005` and leave `006`–`009` reserved. Treat any earlier next-prompt numbering recommendation in `current_state.md` (such as an older `004_scaffold_*` suggestion) as superseded by this queue, and do not renumber existing prompt files. Use filenames matching `^[0-9]{3}_[a-z0-9]+(_[a-z0-9]+)*\.md$`.
6. Keep each planned prompt narrow per `prompt_authoring_guide.md`: one reviewable unit, completable in one session, with observable outcomes. Split any system that is too large for one session (for example, give the turn engine separate prompts for the loop skeleton and for resolution).
7. Order prompts so dependencies always point to lower-numbered prompts; the scaffold prompt must be first and deployment last.
8. Add a final "Out of scope" note pointing to specification section 9 so no build prompt targets deferred features.
9. Use British English throughout.

## Do not implement

This is a planning task. You must plan build prompts for scaffold, CI, and deployment in the roadmap when the specification requires them; you must not implement, configure, or edit any of those yourself. Specifically, do not:
- author any `NNN_*.md` build-prompt files (that is prompt `005`);
- scaffold Svelte/Vite or write any application or content code;
- create, configure, or edit CI, deployment, or GitHub Pages files yourself;
- restructure or contradict the specification.

## Acceptance criteria

The task is complete when:
- `docs-dev/planning/build_roadmap.md` exists and is the only file added or changed besides `current_state.md`;
- every specification system in sections 3–4 and the requirements in sections 1, 2, 5, 6, and 7 maps to at least one planned build prompt;
- no planned prompt targets a feature listed in specification section 9;
- every planned prompt has a unique filename starting at `010`, matching the naming pattern, with dependencies pointing only to lower numbers;
- the scaffold prompt is first and the deployment prompt is last;
- no build-prompt file and no application or content code has been created.

## Checks

Run:

```bash
bash scripts/validate-prompts.sh
```

Then manually confirm the acceptance criteria against the specification. State any limitation in the final report.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request. If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename (`004_author_build_roadmap.md`) as the commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
