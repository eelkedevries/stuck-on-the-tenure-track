# Stuck on the Tenure Track — Specification

Version: 1.8
Last updated: 2026-06-02
Status: Binding project specification

**Audience:** coding-focused LLM tools building this game with the developer.

This document describes the game's product design, scope, and architecture. It should be read together with `AGENTS.md` and `docs-dev/planning/current_state.md` before implementation work.

## 0. Repository workflow

This repository uses direct commits to `main`.

- Always commit and push directly to `main` after completed changes.
- Do not create feature branches unless explicitly instructed.
- Do not open pull requests unless explicitly instructed.
- Keep commits atomic.
- Run relevant checks before committing.

The canonical filename and path for this document is `docs-dev/reference/primary_authoritative/specification.md`.

The shorter overview document is `docs-dev/reference/secondary_background/overview.md`.

---

## 1. Architectural overview

### 1.1 What the game is

*Stuck on the Tenure Track* is a turn-based, browser-based, single-player satirical simulation of an academic career, from undergraduate matriculation to the tenure decision. The player allocates time across research, teaching, service, relationships, funding, and health while competing against three computer-controlled rivals from the same high-school cohort. A full game is approximately 25 turns, covers roughly 18 in-game years, takes around 30 minutes, and runs in smartphone and desktop browsers.

### 1.2 Hard constraints

| Constraint | Value |
|---|---|
| Platform | Browser-based; mobile and desktop |
| Backend dependency | None for beta |
| Runtime LLM | None for beta |
| Runtime per game | Target 25–35 minutes |
| Visual style | Pixel art / retro |
| Spelling | British English |
| Launch language | English |
| Beta discipline | Psychology only |
| Beta sub-disciplines | Cognitive, social, clinical, developmental |
| Multiplayer | Out of scope for beta |
| Save model | Local browser storage |

### 1.3 Soft constraints

- Use Svelte 5 + TypeScript + Vite unless a later instruction changes the stack deliberately.
- Store content in external files under `content/`; do not hardcode discipline-specific content into the engine.
- Keep game state serialisable to JSON without loss.
- Prefer readable implementation over clever implementation.
- Comment non-obvious decisions only.

### 1.4 Tone principles

Player-facing text should be dry, specific, and recognisable. Humour comes from accurate academic detail, not generic absurdity. Use real journal, funder, and conference names where appropriate, but avoid real living academics and avoid defamatory institution-specific text.

---

## 2. Content architecture

The content system has three layers.

### Layer 1: Universal

Universal engine and mechanics: turn engine, resources, publication pipeline, grants, health, misconduct, relationships, cohort tracker, tenure decision logic, saves, and UI framework.

### Layer 2: Broad discipline

For beta, the only broad discipline pack is psychology. It contains authorship conventions, venue type, career-stage durations, broad psychology events, journals, conferences, funders, methods, supervisor archetypes, and name pools.

### Layer 3: Sub-discipline

Nested psychology packs:

- `cognitive`
- `social`
- `clinical`
- `developmental`

Each Layer-3 pack contains sub-discipline-specific journals, methods, event overrides/supplements, and flavour references.

### Inheritance and override

Runtime lookup precedence is Layer 3 → Layer 2 → Layer 1. A Layer-3 event with the same `event_id` as a Layer-2 event overrides it. Layer-1 events remain universal.

### Recommended content directory

```text
content/
  core/
    events.yaml
    mechanics_text.yaml
    supervisor_archetypes.yaml
  disciplines/
    psychology/
      meta.yaml
      journals.yaml
      conferences.yaml
      funders.yaml
      methods.yaml
      events.yaml
      characters.yaml
      sub-disciplines/
        cognitive/
          meta.yaml
          journals.yaml
          methods.yaml
          events.yaml
          figures.yaml
        social/
        clinical/
        developmental/
```

This hierarchy is a core architectural constraint. Psychology-specific content must not be embedded in the engine.

---

## 3. Time, turns, and calendar

One turn is an abstract career turn rather than a fixed three-month term. The full game spans approximately 25 turns and covers approximately 18 in-game years from undergraduate study to the tenure decision.

The calendar advances by stage-specific intervals so that short early stages and longer later stages can both fit into a 25-turn, 30-minute playthrough. The engine should still maintain real dates for event timing, but turn duration may vary by career stage.

The engine maintains both:

```yaml
calendar:
  current_date: ISO date
  turn_number: integer
  start_date: ISO date
```

The beta uses a Dutch/EU academic calendar for event flavour and timing:

- Autumn term: September to late January.
- Spring term: February to late June.
- Summer: July to August.

Career-stage turn budget, subject to playtesting:

| Stage | In-game years | Approx. turns | Approx. duration per turn |
|---|---:|---:|---:|
| Undergraduate | 3 | 3 | 1 year |
| MSc | 2 | 2 | 1 year |
| PhD | 4 | 8 | 6 months |
| Postdoc(s) | 3 | 6 | 6 months |
| Assistant professor | 6 | 6 | 1 year |
| Total | ~18 | ~25 | variable |

The engine must support calendar-conditional events: exam weeks, summer recruitment difficulty, salary/stipend events, grant-call dates, and conference seasons. Events should use calendar dates or career-stage windows rather than assuming a globally fixed turn length.

Within a turn, the player moves across a campus/life board (§4.11) and spends the turn's time points at locations. The time points are the turn's **clock**: travelling between locations, doing activities, relaxing, and attending timed appointments (§4.11a) all draw it down, and the turn **resolves automatically when the clock reaches zero** — there is no manual "end turn". A player who wants to stop early can relax to let the rest of the time pass. A turn remains an abstract, long career step — the per-stage 6–12 month calendar above is unchanged — so this within-turn clock is a game abstraction rather than literal hours. Travel between board locations costs time in proportion to distance; relaxing/resting reduces stress (§4.1).

---

## 4. Core systems

### 4.1 Resources

```yaml
funds:
  personal: integer
  research: integer
wellbeing:
  sleep: integer
  mood: integer
  physical: integer
expertise:
  methods: integer
  theory: integer
  writing: integer
  statistics: integer
  teaching: integer
  politics: integer
standing:
  rank: enum
  reputation: integer
  affiliation_prestige: integer
```

The h-index is computed from papers rather than stored independently.

### 4.2 Turn engine

Canonical turn loop:

1. Turn start: advance date, apply automatic effects, determine eligible events and pending deadlines.
2. Event phase: show mandatory and optional events, anchored to location, action, deadline, or context where possible.
3. Action phase: the player moves across the campus board (§4.11) and chooses location-bound actions, spending the time-point budget; movement deducts an abstract context-switching cost. The board is the primary interaction surface.
4. Resolution phase: resolve outcomes into the substantive systems (papers, grants, health, relationships, reputation), update state, advance/expire deadlines, and check milestones and game-end triggers.
5. Rival phase: AI rivals act and the cohort tracker updates; rivals may also surface as in-world sightings.
6. Save game state.
7. End turn, with a concise diary recap of what happened.

Time uses abstract time points. A default of 100 TP per full turn is recommended, independent of the calendar duration represented by that turn.

Action categories: research, teaching, service, networking, funding, personal, and misconduct. These remain the internal effect taxonomy; the player experiences them as concrete, location-bound actions rather than as a global numeric allocation.

### 4.3 Publication system

Papers are first-class objects.

```yaml
paper_id: unique_string
title: string
authors:
  - author_id: string
    position: integer
    is_corresponding: boolean
journal:
  name: string
  tier: integer
  impact_factor: float
status: enum
date_started: date
date_submitted: date | null
date_published: date | null
date_retracted: date | null
citations: integer
citations_history:
  - date: date
    count: integer
methodology_quality: integer
contains_misconduct: enum
contains_misconduct_by: author_id | null
preregistered: boolean
open_data: boolean
visibility: integer
```

Lifecycle: in preparation → submitted → revision/rejection → publication → citation accrual/retraction risk.

Psychology authorship convention: first author matters most, last author carries senior-author weight, middle authors carry reduced weight.

Citation dynamics should be long-tailed, with top-tier papers receiving substantially more citations than low-tier papers and most citations accruing in years 2–5.

### 4.4 Grant system

```yaml
grant_id: unique_string
funder: string
scheme: string
amount: integer
duration_turns: integer
call_opens: date
call_closes: date
typical_success_rate: float
requires:
  rank: enum
  years_since_phd_min: integer | null
  years_since_phd_max: integer | null
```

Grant success depends on base success rate, writing expertise, politics expertise, time investment, prior grants, publication record, and luck.

Beta grant content should include ERC Starting Grant, NWO Veni, NWO Vidi, optional NIH R01-equivalent, and smaller seed grants.

### 4.5 Relationships

Relationships are tracked as individual NPC objects.

```yaml
npc_id: unique_string
name: string
gender: enum
role_relative_to_player: enum
relationship_score: integer
relationship_status: enum
last_interaction_turn: integer
persistent: boolean
shared_papers: [paper_id]
notes: string
```

Important roles: partner, family, friends, collaborators, supervisor, PhD students, postdocs, and departmental colleagues. The supervisor relationship is especially consequential during the PhD stage.

Supervisor archetypes: supportive mentor, hands-off, micromanager, status-driven, absent, exploitative.

### 4.6 Specialisation

```yaml
specialisation:
  status: enum
  current_sub_discipline: string | null
  commitment_turn: integer | null
```

The player begins undeclared, leans during MSc choice, commits during PhD supervisor selection, and can switch later at significant cost.

### 4.7 Health system

Health is mechanical, not flavour. Sleep, mood, and physical health update each turn. Severe conditions reduce effective productivity and cannot be ignored.

```yaml
health_conditions:
  - condition_id: string
    type: enum
    severity: enum
    onset_turn: integer
    status: enum
    treatment_in_progress: enum
    productivity_penalty: float
```

Treatment actions include GP visit, therapy, medication, reduced workload, and sick leave. Some conditions can become chronic. The end-game CV records conditions experienced.

Imposter syndrome is a separate subsystem tracking perceived competence, actual competence, and their gap. Large gaps can lead to auto-declined opportunities.

### 4.8 Misconduct system

Misconduct is tracked per paper, not as a global player flag.

Grey-area practices: HARKing, selective reporting, p-hacking, gift authorship, salami-slicing, citation cartels/self-citation gaming.

Outright misconduct: fabrication, falsification, plagiarism.

Detection depends on visibility, co-authors, data sharing, time since publication, whistleblower risk, and random scrutiny. Across many playthroughs, a misconduct strategy should have negative or marginal expected value.

### 4.9 Cohort tracker and AI rivals

Three AI rivals run in parallel with the player. Rivals are scripted stochastic archetypes, not runtime LLMs.

Archetypes:

- grinder;
- networker;
- gambler;
- genuine scholar.

The cohort tracker shows public outputs only: rank, publications, h-index, major recent events, and institution prestige. Rivals' private wellbeing, relationships, and misconduct are hidden.

### 4.10 Milestones and endings

Milestones:

- MSc thesis defence;
- PhD dissertation defence;
- assistant professor appointment;
- tenure decision.

The win condition is the first tenured offer in the cohort. All endings produce a CV-style summary including achievements and personal costs.

### 4.11 Campus/map and board interaction

The campus board is the **primary interaction surface**. The player has a current location, moves between locations (at an abstract context-switching time cost, §3), and chooses location-bound actions there, spending the turn's time-point budget. Desktop uses a pixel-art campus map; mobile uses a scrollable location list. Locations include office, lab, library, classroom, seminar room, café/pub, home, conference venue, funder portal, gym/outdoors, GP/therapist/occupational health. Each location binds a subset of the action categories; some actions can consume most of the remaining budget (e.g. running studies in the lab, recovering at home).

The board should communicate: where the player is, where they can go and at what time cost, time remaining, available actions, pressing deadlines, recent events, and whether rivals are visible or being discussed. The broad action categories remain the internal effect taxonomy; the player experiences concrete, location-bound actions.

**Location memory.** The game records where the player spends time and applies readable consequences over a window — for example, never appearing in visibility-relevant locations lowers visibility (the ghost penalty), always staying in the lab improves output but weakens reputation, and never going home erodes sleep. A ghost penalty applies to players who never appear in visibility-relevant social locations.

**Career-stage variation.** The same locations persist across career stages, but their available actions and pressures change. Each location offers concrete, named activities appropriate to the stage (e.g. the lab moves from running a study, to analysing data and supervising, to managing a lab and chasing ethics). During the student stages (undergraduate, MSc) the academic locations are for studying, attending lectures, sitting exams, and thesis work; students build expertise but do not publish papers or win grants. The research career — and publishing — begins at the PhD.

### 4.11a Deadlines and pressure

The game maintains a visible deadline-pressure layer that supports the board rather than replacing it. Deadlines are objects tied to the calendar with urgency states — **due now, soon, later, overdue** — seeded from existing calendar-bound systems (grant calls, milestone reviews) and extensible to paper revisions, teaching prep, health, relationship, and admin deadlines. Missed deadlines usually create interesting consequences that feed existing systems — delays, reputation/relationship/health costs, missed opportunities, reduced future options — rather than immediate failure. Deadlines must not introduce win/lose conditions independent of the milestones and tenure decision, and their density and severity should be tuned to avoid constant crisis.

### 4.12 End-game CV

The end screen is formatted as a psychology CV and includes publications, citations, grants, awards, teaching, service, final placement, and a secondary list of costs: relationships ended, hobbies abandoned, sick leave, chronic conditions, short-term cities, and sleep deficit.

Sharing should initially generate a client-side PNG. Shareable URLs are optional and out of scope for beta unless explicitly requested.

---

## 5. UI and platform requirements

- Modern desktop browsers: Chrome, Firefox, Safari, Edge.
- Modern mobile browsers: Chrome/Safari on Android/iOS.
- Mobile-first responsive layout.
- Save at every turn end to local browser storage.
- One save slot is acceptable for beta.
- Reset/new-game option clears the local save.
- Pixel-art/retro aesthetic.
- Adequate contrast, text labels for colour-coded information, browser zoom support, and keyboard navigability.
- Target time to interactive: under 3 seconds on a mid-range smartphone over 4G.
- Target bundle size: under 5 MB for beta.
- Turn resolution including rivals: under 1 second.

---

## 6. Deployment

The beta is a static GitHub Pages site. Because this repository is public, deployment may occur from this repository when configured. No production bundle may contain secrets, credentials, development notes, prompt files, source maps, or private notes.

A later instruction should add CI/deployment deliberately. Do not add deployment as part of unrelated feature work.

---

## 7. Content authoring rules

Player-facing content should be:

- dry, specific, and satirical;
- grounded in real academic situations;
- written in British English;
- concrete rather than generic;
- non-moralising.

Use real journal, conference, and funder names where appropriate. Avoid real living academics and avoid defamatory real-institution jokes.

Layer-3 events should only be sub-discipline-specific. If an event works across psychology, put it in Layer 2.

---

## 8. Save schema

```yaml
save_version: integer
game_seed: string
created_at: ISO datetime
last_played_at: ISO datetime
calendar:
  current_date: ISO date
  turn_number: integer
  start_date: ISO date
settings:
  spelling: string
  light_narrative_mode: boolean
player:
  name: string
  gender: string
  broad_discipline: string
  funds: object
  wellbeing: object
  expertise: object
  standing: object
  specialisation: object
  imposter_state: object
  health_conditions: array
  papers: array
  grants_held: array
  grants_applied: array
  relationships: array
  milestones_completed: array
  location_visits: array        # board interaction: history of visited locations
board:
  current_location: string      # the player's current board location id
  time_remaining: integer       # within-turn time-point budget remaining
deadlines: array                # scheduled deadlines with type, due date, status
rivals: array
events_history: array
```

The board interaction (§4.11, §4.11a) adds the `board`, `deadlines`, and `player.location_visits` state. Introducing these bumps `save_version`; because the beta uses a single local slot, incompatible older saves are reset on load rather than partially migrated.

Full sub-object schemas belong in their system modules and should match the reference sections above.

---

## 9. Out of scope for beta

- Multiplayer.
- Broad disciplines other than psychology.
- Sub-disciplines other than cognitive, social, clinical, and developmental.
- Jurisdictions other than Dutch/EU.
- Runtime LLM integration.
- Accounts, cloud sync, or server-side state.
- Localisation.
- Mobile app packaging.
- Global leaderboards/community backend.
- Advanced character creation.
- Post-tenure gameplay.

When in doubt, implement the smallest version compatible with this specification and surface the choice in the final report.
