# Task: Wire action outcomes into the existing systems

## Goal

Make committed actions actually drive the substantive systems, so spending time
on research, funding, personal, etc. produces papers, grant activity, health
changes, and relationship changes — not just generic stat nudges.

## Scope

Engine wiring only, reusing the existing system modules. Do not build the board
or change content. Implement only the resolution wiring described here.

## Context

Implements roadmap M17. Specification §4.2, §4.3 (papers), §4.4 (grants), §4.6
(health), §4.5 (relationships). Today `src/engine/resolution.ts` applies only
light generic effects and never calls the papers/grants/health/relationship
modules. Depends on `025`, `027`, `033`, `035`, `040`, `074`.

## Required changes

1. In the resolution phase, translate the committed `Allocation` into real
   system effects using the existing modules:
   - research → advance/create papers via the paper lifecycle (`src/papers`);
   - funding → grant applications/progress via the grant model (`src/grants`);
   - personal and sustained overwork → wellbeing and health-condition changes
     (`src/health`);
   - networking/personal → relationship maintenance, neglect decay elsewhere
     (`src/relationships`).
2. Keep effects modest and proportional to time spent; preserve the existing
   generic expertise/wellbeing nudges where they still make sense.
3. Record outcomes on the existing `SaveGame` collections (papers, grants_held,
   grants_applied, relationships, health_conditions) without changing the save
   schema.

## Do not implement

Do not:
- add the board, movement, deadlines, or the event engine (later prompts);
- change the save schema or content packs;
- invent new systems — only wire the ones that already exist.

## Acceptance criteria

The task is complete when:
- committing turns with research/funding/personal time produces observable
  changes in papers, grants, health, and relationships in game state;
- a full playthrough still reaches the end-game and the CV reflects real
  publications/grants where they were produced;
- `npm run check` passes.

## Checks

Run `npm run check`. Where visible, run `npm run dev` and confirm a turn's
actions change the relevant state.

## Commit and push

Always commit and push directly to `main`; no feature branch or pull request.
If and only if the scope was followed and checks pass, create one commit on
`main` using this file's exact filename (`075_wire_action_outcomes.md`) as the
commit message, then push `main`.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
