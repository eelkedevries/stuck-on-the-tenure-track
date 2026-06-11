# Task: Jones-fidelity and fun-factor pass — money, race, characters

## Goal

Make the board game feel like *Jones in the Fast Lane* re-themed as the academic rat race, and above all make it fun: a money pressure loop (stipend in, rent out, paid work on the board), a visible cohort race with rivals on the board, a named character with rotating patter in every location interior, and immediate feedback when the player acts.

## Scope

Presentation plus a light gameplay layer over existing systems. Preserve the deep simulation (papers, grants, health, relationships, rivals, deadlines, appointments), the save schema (no new persisted fields — `funds` already exists), the action categories, and the turn loop. Implement only the work described in this prompt.

## Context

Read:
- `AGENTS.md`
- `src/App.svelte`, `src/ui/CampusMap.svelte`, `src/ui/BoardScreen.svelte`, `src/ui/game.svelte.ts`
- `src/locations/stages.ts`, `src/locations/types.ts`
- `src/rivals/` (simulation, cohort, archetypes)
- `src/engine/events.ts` (`applyEventEffects` already moves `funds`)
- `docs-dev/reference/primary_authoritative/specification.md` §2 (salary/stipend events), §4.1 (funds), §4.9 (rivals), §4.11 (board)

Observed gaps against the Jones model:
1. Money exists in state but has no earn/spend loop and is not shown anywhere.
2. Rivals are simulated but invisible on the board (the token layer stacked them all on the player's tile).
3. Location interiors are scenes plus a bare menu — no characters, no dialogue, no charm.
4. Acting gives no immediate feedback; turn labels said "day" while the calendar advances ~six months.

## Required changes

1. **Term finances** (`src/economy/economy.ts`): per-stage income (loan/stipend/salary) and rent applied at term end, diary lines for the recap, and an overdraft penalty (stress up, mood down). Amounts tuned so the stipend barely clears the rent.
2. **Money on the board** (`src/locations/stages.ts`): a `cash` field on activities; paid work (bar shifts, tutoring, marking, invigilating, conference helper) and priced activities (rounds, gym, GP, therapy, conference fees) per stage; shared gym/health/park entries. Purchases the player cannot afford are refused.
3. **Cash visibility**: balance chip in the header (red when overdrawn), prices and pay on activity rows and the Location tab, money story in the diary recap.
4. **Visible race** (`src/rivals/race.ts`, `src/rivals/positions.ts`): one comparable public score (publications, h-index, prestige, and the player's reputation) with joint-position ties; a race strip under the HUD with standings and a one-line summary; rival tokens at deterministic board locations each term; the Cohort tab becomes the full race table including the player; a "rival is here" note in the interior when paths cross.
5. **Location characters** (`src/ui/npcs.ts`, `src/assets/sprites/npcs/`): a named pixel-art character per location with rotating satirical lines, drawn in the existing sprite style and shown in a speech bubble in the centre window.
6. **Feedback and wording**: a feedback toast over the scene when the player acts (label, time, cash, headline effects); missed appointments stay visible on the strip as MISSED; all player-facing "day" wording becomes "term" with one-based term numbering; display names unified via `src/ui/locationMeta.ts`; building tiles get Jones-style name signs.

## Acceptance criteria

- `npm run check` passes (svelte-check, tsc, build, public-build check).
- A new game starts with tight cash (£350) and the header shows the balance at all times.
- Bar shifts and tutoring visibly pay; conference presenting visibly costs; the recap reports income, rent, and balance every term.
- The race strip orders the player and the three rivals by score with shared positions for ties, and rival tokens appear on board tiles away from the player.
- Every location interior shows its character with a line that changes between visits.
- No save-schema changes; existing saves keep loading.

## Out of scope

- Engine simulation internals (papers, grants, health, relationships models).
- Sound effects, housing choice, goal-setting at game start, tests, deployment.
