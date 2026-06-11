# Task: Fun-factor research pass — variance, promises, and honest luck

## Goal

Apply researched game-design findings to make every term play differently and
end on a hook: refill the event well, add mid-term surprises and push-your-luck
gambles, make failure tax the next term's clock instead of being silent, and
close each term with a "next term" teaser.

## Scope

Engine-light additions over existing systems plus content authoring. Preserve
the save schema (no new persisted fields), the deep simulation, the action
categories, and the turn loop. Implement only the work described in this
prompt.

## Context

Five web-research reports (Jones in the Fast Lane mechanical teardown; Sid
Meier/decision design; life-sim random-event systems — KoDP, Reigns, Fallen
London, CK2; reward/near-miss/juice literature; rivals and academic-satire
games) produced these load-bearing findings:

1. The event pool exhausts after two terms per stage (terms 3 and 5 measured at
   zero events), recreating Jones's documented "identical-week grind".
2. Variable-ratio rewards on repeatable actions are the strongest known
   engagement schedule (Hopson); near-misses must be honest, busts softened
   (Quacks of Quedlinburg), and celebration keyed to net outcomes.
3. "One more turn" is built from staggered, visible promises (Meier/Civ;
   Zeigarnik; goal-gradient) — end every turn teasing what is nearly ripe.
4. Jones taxes failure with next-week time (starving −20h), never a game over.
5. Charm amortises repetition: rotating patter, named places, retellable
   anecdotes (RimWorld "story generator", Reigns callbacks).

## Required changes

1. **Event reuse after cooldown** (`src/engine/events.ts`): when provided
   seen-event history, events seen ≥3 turns ago become eligible again; fresh
   events always outrank returning ones.
2. **More events** (`content/`): ~8 universal events in the core pack and ~14
   stage-tagged psychology events, all two-choice dilemmas with no dominant
   option, several with money effects.
3. **Campus moments** (`src/engine/moments.ts`): ~30%-chance micro-events on
   first arrival at a location each term, location- and stage-scoped, light
   event-style effects, surfaced as a board flash. Skewed neutral-to-positive.
4. **Variable activity outcomes** (store): a 12% bonus / 6% snag roll on
   ordinary activities (paid work can tip extra cash), applied through the
   ordinary event-effects path and announced in the flash.
5. **Push-your-luck gambles** (`stages.ts` `gamble` field): the pub quiz at
   every stage's café (stake £10, 35% to win £60, loss still pays +1 mood) and
   the PhD three-minute-thesis contest (25% for reputation + £100, loss costs
   stress). Odds shown on the activity row.
6. **Start-of-term handicap** (store): starting a term short of sleep, over
   stressed, unwell, or overdrawn costs 5–25 time points off the clock, with a
   flash explaining why — failure taxes time, never ends the run.
7. **Unified flash channel** (store → board): one toast pipeline for action
   summaries, crits, gamble outcomes, moments, and the handicap notice.
8. **Recap teaser** (`recap.ts`, `DiaryScreen`): up to three "Next term" lines
   (nearest deadline, papers under review, near-complete stage goal, rent vs
   balance, race gap) in a gold panel, plus staggered reveal animation on
   diary lines (reduced-motion safe).

## Acceptance criteria

- `npm run check` passes.
- No term starts with zero variance once a stage's fresh pool is spent
  (cooldown reuse observed in a scripted 10-term run).
- Moments, bonus/snag sparks, and gamble outcomes all observable in a scripted
  run; the handicap fires after a wrecked term.
- Every recap ends with at least one teaser line in normal play.
- No save-schema changes.

## Out of scope

- Engine simulation internals; resubmission ladder for papers; chained
  callback events with flags; advisor opinions on events; funding-climate
  economy weather; durable goods. Recorded as future prompt ideas.
