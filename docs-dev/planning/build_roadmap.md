# Build roadmap

This roadmap turns the binding specification (`docs-dev/reference/primary_authoritative/specification.md`) into an explicit, dependency-ordered queue of narrow build prompts that implement *Stuck on the Tenure Track*. It is the source of truth for build-prompt numbering and ordering.

## How to use

- The individual build-prompt files are authored by prompt `005_author_build_prompt_files.md`, one file per row below, using the exact filenames given here.
- Each build prompt is executed one at a time per `docs-dev/agent/prompt_execution_guide.md`, committed and pushed directly to `main`.
- Build prompts are numbered sequentially from `010`; `006`–`009` are reserved and meta-prompts occupy `001`–`005`. Do not renumber existing prompt files. Any earlier next-prompt recommendation in `current_state.md` is superseded by this queue.
- `Depends on` lists prerequisite prompt numbers; every dependency points to a lower number. The scaffold is first; deployment is last.

## Deviations from baseline

The milestone baseline in `004_author_build_roadmap.md` is followed, with these spec-driven adjustments recorded as required:

- **Turn engine split (M3).** The turn loop is split into a loop skeleton (`023`), time-point/action allocation (`024`), and a separate resolution phase (`025`), because a single prompt covering the full 7-phase loop plus resolution would exceed one reviewable unit (spec §4.2; authoring guide).
- **Discipline content centralised in M15.** Engine milestones (M4–M14) build mechanics, types, and only minimal inline test fixtures; all psychology journals, conferences, funders, methods, events, characters, and name pools live in the M15 content packs. This honours the hard constraint that discipline-specific content must not be embedded in the engine (spec §1.3, §2). Consequently the "beta grant set" named in the M5 baseline is authored as content in M15 (`064`), not in the grant-engine prompts.
- **Saves before turn loop.** Local-storage save/load (`020`) is sequenced before the turn loop (`023`) because the loop's save phase depends on it (spec §4.2 step 6).

---

## M0 — Foundations (spec §1.3, §5, §6)

| Prompt file | One-sentence goal | Depends on | Spec section |
|---|---|---|---|
| `010_scaffold_svelte_vite.md` | Add the initial Svelte 5 + TypeScript + Vite scaffold with the `/stuck-on-the-tenure-track/` base path, a working `npm run check`, and a dev server that starts. | — | §1.3, §5 |
| `011_public_build_safety_check.md` | Wire `scripts/check-public-build.sh` into the verify command so `docs-dev/` can never reach `dist/`. | 010 | §6 |
| `012_ci_workflow.md` | Add a GitHub Actions workflow that runs `npm ci`, build, `npm run check`, `validate-prompts.sh`, the public-build check, and a secret scan on every push. | 010, 011 | §6 |

## M1 — Content architecture (spec §2, §7)

| Prompt file | One-sentence goal | Depends on | Spec section |
|---|---|---|---|
| `013_content_dir_and_types.md` | Create the `content/` directory skeleton and JSON-serialisable TypeScript types for layered content objects. | 010 | §2 |
| `014_yaml_content_loader.md` | Add a YAML content loader that reads the `content/` files into typed objects. | 013 | §2 |
| `015_three_layer_inheritance.md` | Implement Layer 3 → Layer 2 → Layer 1 lookup precedence with same-`event_id` override. | 014 | §2 |
| `016_example_objects_per_layer.md` | Add one example event at each of the three layers to demonstrate inheritance and override. | 015 | §2, §7 |

## M2 — State and saves (spec §4.1, §8)

| Prompt file | One-sentence goal | Depends on | Spec section |
|---|---|---|---|
| `017_resource_and_state_types.md` | Define the resource and game-state types (funds, wellbeing, expertise, standing, specialisation, imposter, etc.). | 013 | §4.1 |
| `018_save_schema_types.md` | Define the save-schema types exactly as in the specification. | 017 | §8 |
| `019_serialise_deserialise.md` | Serialise and deserialise the full game state to and from JSON without loss. | 017, 018 | §8 |
| `020_local_storage_saves.md` | Save to, load from, and reset a single local-browser-storage save slot. | 019 | §5, §8 |

## M3 — Calendar and turn engine (spec §3, §4.2)

| Prompt file | One-sentence goal | Depends on | Spec section |
|---|---|---|---|
| `021_calendar_model.md` | Implement the calendar (`current_date`, `turn_number`, `start_date`) with ISO dates. | 017 | §3 |
| `022_stage_turn_budget.md` | Implement the career-stage turn budget so turn duration varies by stage. | 021 | §3 |
| `023_turn_loop_skeleton.md` | Implement the 7-phase turn loop skeleton (start → event → action → resolution → rival → save → end) with stubbed phases. | 020, 021, 022 | §4.2 |
| `024_time_points_and_actions.md` | Implement the 100-TP-per-turn budget and the action categories with allocation/commit. | 023 | §4.2 |
| `025_turn_resolution.md` | Implement the resolution phase: apply outcomes, update state, and check milestones and game-end triggers. | 023, 024 | §4.2 |

## M4 — Publications (spec §4.3)

| Prompt file | One-sentence goal | Depends on | Spec section |
|---|---|---|---|
| `026_paper_objects.md` | Define the first-class paper object type with all specified fields. | 017 | §4.3 |
| `027_paper_lifecycle.md` | Implement the paper lifecycle transitions (in preparation → submitted → revision/rejection → published → retracted). | 026 | §4.3 |
| `028_authorship_weighting.md` | Implement first/last/middle-author weighting for psychology authorship. | 026 | §4.3 |
| `029_citation_dynamics.md` | Implement long-tailed citation accrual concentrated in years 2–5, tier-dependent. | 027 | §4.3 |
| `030_h_index_computation.md` | Compute the h-index from papers rather than storing it. | 029 | §4.3 |

## M5 — Grants (spec §4.4)

| Prompt file | One-sentence goal | Depends on | Spec section |
|---|---|---|---|
| `031_grant_objects_and_types.md` | Define the grant object type with scheme, amount, duration, and eligibility requirements. | 017, 021 | §4.4 |
| `032_grant_calendar_calls.md` | Open and close grant calls on calendar dates with eligibility gating. | 031, 021 | §4.4 |
| `033_grant_success_model.md` | Implement the grant success model (base rate, writing, politics, time, record, luck). | 032 | §4.4 |

## M6 — Relationships (spec §4.5)

| Prompt file | One-sentence goal | Depends on | Spec section |
|---|---|---|---|
| `034_npc_objects_and_types.md` | Define NPC relationship objects with role, score, status, and shared papers. | 017 | §4.5 |
| `035_relationship_decay.md` | Implement per-role relationship decay when neglected. | 034 | §4.5 |
| `036_supervisor_archetypes.md` | Implement the six supervisor archetypes and their PhD-stage effects. | 034 | §4.5 |

## M7 — Specialisation (spec §4.6)

| Prompt file | One-sentence goal | Depends on | Spec section |
|---|---|---|---|
| `037_specialisation_state.md` | Implement the specialisation state (undeclared, current sub-discipline, commitment turn). | 017 | §4.6 |
| `038_specialisation_progression.md` | Implement progression: undeclared → lean → commit → switch-at-significant-cost. | 037 | §4.6 |

## M8 — Health and imposter (spec §4.7)

| Prompt file | One-sentence goal | Depends on | Spec section |
|---|---|---|---|
| `039_health_resources.md` | Update coupled sleep, mood, and physical health each turn. | 017 | §4.7 |
| `040_health_conditions.md` | Implement health conditions with severity, chronicity, and productivity penalties. | 039 | §4.7 |
| `041_treatment_actions.md` | Implement treatment actions (GP, therapy, medication, reduced workload, sick leave). | 040 | §4.7 |
| `042_imposter_subsystem.md` | Implement the imposter subsystem tracking perceived vs actual competence and auto-declines. | 039 | §4.7 |

## M9 — Misconduct (spec §4.8)

| Prompt file | One-sentence goal | Depends on | Spec section |
|---|---|---|---|
| `043_misconduct_per_paper.md` | Track grey-area and outright misconduct per paper, attributed to an author. | 026 | §4.8 |
| `044_misconduct_detection.md` | Implement the detection model so a misconduct strategy has non-positive expected value. | 043, 030 | §4.8 |

## M10 — Cohort and rivals (spec §4.9)

| Prompt file | One-sentence goal | Depends on | Spec section |
|---|---|---|---|
| `045_rival_archetypes.md` | Define the four rival archetypes (grinder, networker, gambler, genuine scholar). | 017 | §4.9 |
| `046_rival_simulation.md` | Run three scripted stochastic rivals in parallel during the rival phase. | 045, 025 | §4.9 |
| `047_cohort_tracker.md` | Expose a public-only cohort tracker (rank, publications, h-index, events, prestige). | 046 | §4.9 |

## M11 — Milestones and endings (spec §4.10)

| Prompt file | One-sentence goal | Depends on | Spec section |
|---|---|---|---|
| `048_milestone_framework.md` | Implement the four milestones (MSc, PhD, appointment, tenure) as failable gates. | 025 | §4.10 |
| `049_tenure_decision.md` | Implement the partly stochastic tenure decision and the first-tenured-offer win condition. | 048, 030, 033 | §4.10 |

## M12 — Campus and locations (spec §4.11)

| Prompt file | One-sentence goal | Depends on | Spec section |
|---|---|---|---|
| `050_location_model.md` | Model locations and bind actions to them. | 024 | §4.11 |
| `051_campus_map_desktop.md` | Add the desktop pixel-art campus map for choosing locations. | 050 | §4.11 |
| `052_location_list_mobile.md` | Add the scrollable mobile location list. | 050 | §4.11 |
| `053_ghost_penalty.md` | Apply the ghost penalty for never appearing in visibility-relevant locations. | 050 | §4.11 |

## M13 — UI framework and screens (spec §5)

| Prompt file | One-sentence goal | Depends on | Spec section |
|---|---|---|---|
| `054_ui_shell.md` | Add a mobile-first responsive pixel-art UI shell with contrast, labels, zoom, and keyboard navigability. | 010 | §5 |
| `055_turn_screen.md` | Add the turn screen showing calendar, resources, and stage. | 054, 020, 021 | §5 |
| `056_event_screen.md` | Add the event screen for mandatory and optional events. | 054, 023 | §5 |
| `057_action_allocation_screen.md` | Add the action screen for allocating the time-point budget across categories. | 054, 024 | §5 |
| `058_cohort_screen.md` | Add the cohort-tracker screen. | 054, 047 | §5 |
| `059_save_load_ui.md` | Add new-game, reset, and resume controls bound to the save system. | 054, 020 | §5 |

## M14 — End-game CV (spec §4.12)

| Prompt file | One-sentence goal | Depends on | Spec section |
|---|---|---|---|
| `060_cv_screen.md` | Render the CV-formatted end screen (publications, citations, grants, awards, teaching, service, placement). | 054, 030, 049 | §4.12 |
| `061_costs_list.md` | Add the secondary costs list (relationships ended, hobbies, sick leave, chronic conditions, short-term cities, sleep deficit). | 060, 040, 035 | §4.12 |
| `062_cv_png_export.md` | Generate a client-side PNG of the CV for sharing. | 060 | §4.12 |

## M15 — Content packs (spec §2, §7)

| Prompt file | One-sentence goal | Depends on | Spec section |
|---|---|---|---|
| `063_psychology_meta_and_pack.md` | Add the Layer-2 psychology `meta.yaml` and pack skeleton. | 015 | §2, §7 |
| `064_psychology_journals_conferences_funders.md` | Author psychology journals, conferences, and funders (including ERC Starting, NWO Veni/Vidi, NIH R01-equivalent, and seed grants). | 063 | §2, §4.4, §7 |
| `065_psychology_methods_and_characters.md` | Author psychology methods, supervisor-archetype content, and name pools. | 063 | §2, §7 |
| `066_psychology_events.md` | Author the Layer-2 broad-psychology events. | 063, 016 | §2, §7 |
| `067_subdiscipline_cognitive.md` | Author the cognitive Layer-3 pack (journals, methods, event overrides, figures). | 063 | §2, §7 |
| `068_subdiscipline_social.md` | Author the social Layer-3 pack. | 063 | §2, §7 |
| `069_subdiscipline_clinical.md` | Author the clinical Layer-3 pack. | 063 | §2, §7 |
| `070_subdiscipline_developmental.md` | Author the developmental Layer-3 pack. | 063 | §2, §7 |

## M16 — Polish and deploy (spec §5, §6)

| Prompt file | One-sentence goal | Depends on | Spec section |
|---|---|---|---|
| `071_performance_budget.md` | Meet the performance budgets (bundle < 5 MB, time-to-interactive < 3 s, turn resolution < 1 s). | 059, 070 | §5 |
| `072_deploy_github_pages.md` | Add the GitHub Pages deployment workflow that publishes only the build output. | 012, 071 | §6 |

---

## Out of scope

No build prompt above targets any feature listed in specification section 9 (out of scope for beta): multiplayer; broad disciplines other than psychology; sub-disciplines other than cognitive, social, clinical, and developmental; non-Dutch/EU jurisdictions; runtime LLM integration; accounts, cloud sync, or server-side state; localisation; mobile app packaging; global leaderboards; advanced character creation; and post-tenure gameplay. When a build prompt is ambiguous, implement the smallest version compatible with the specification and surface the choice in the final report.
