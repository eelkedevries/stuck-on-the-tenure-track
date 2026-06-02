// Event selection and effects (specification §2, §4.2; prompts 076, 086).
//
// Chooses a turn's events from the content events scoped to the player, using
// the current context — career stage, the action categories the player just
// leaned into, and which events have already been seen. Selection is data-driven
// (it matches event conditions and tags); no specific events are hardcoded.
// Presentation is handled by the UI layer, which shows the selected events
// through EventScreen, applies a chosen choice's effects, and records the
// resolution in `events_history`.

import type { ContentEvent, EventEffects } from '../content/types';
import type { ContentPack } from '../content/types';
import { resolveEvents } from '../content/inheritance';
import type { Stage } from '../calendar/stages';
import type { ActionCategory } from './actions';
import type { SaveGame } from '../state/save';

// Structurally compatible with EventScreen's entry. `resolved` holds the chosen
// choice's outcome text once the player has responded.
export interface SelectedEvent {
  event: ContentEvent;
  mandatory: boolean;
  resolved?: string;
}

export interface EventContext {
  stage: Stage;
  recentCategories: ActionCategory[];
  seenEventIds: string[];
  rng?: () => number;
}

// Maximum events surfaced in a turn: one mandatory plus up to two optional.
const MAX_EVENTS = 3;

// The events available to a player: core + discipline, plus only the player's
// committed sub-discipline (so an undeclared or early player never sees, say,
// developmental infant-testing events). Layer override still applies.
export function eventPoolFor(packs: ContentPack[], subDiscipline: string | null): ContentEvent[] {
  const scoped = packs.filter(
    (p) =>
      p.meta.layer !== 'sub-discipline' ||
      (subDiscipline !== null && (p.meta.id === subDiscipline || p.meta.parent === subDiscipline)),
  );
  return [...resolveEvents(scoped).values()];
}

// An event is eligible if its declared conditions match the context. `stages`
// (array) gates by career stage; unknown condition keys are ignored.
function eligible(event: ContentEvent, ctx: EventContext): boolean {
  const conditions = event.conditions;
  if (!conditions) return true;
  if (typeof conditions.stage === 'string' && conditions.stage !== ctx.stage) {
    return false;
  }
  if (Array.isArray(conditions.stages) && !conditions.stages.includes(ctx.stage)) {
    return false;
  }
  return true;
}

export function selectTurnEvents(events: ContentEvent[], ctx: EventContext): SelectedEvent[] {
  const rng = ctx.rng ?? Math.random;
  const seen = new Set(ctx.seenEventIds);
  const pool = events.filter((e) => !seen.has(e.event_id) && eligible(e, ctx));
  if (pool.length === 0) return [];

  // Score by relevance to what the player just did, with a random tiebreak so
  // turns vary. Tags that name an action category the player leaned into score
  // higher.
  const recent = new Set<string>(ctx.recentCategories);
  const scored = pool
    .map((event) => {
      const tags = event.tags ?? [];
      const relevant = tags.some((t) => recent.has(t));
      return { event, score: (relevant ? 2 : 1) + rng() };
    })
    .sort((a, b) => b.score - a.score);

  return scored
    .slice(0, MAX_EVENTS)
    .map((entry, i) => ({ event: entry.event, mandatory: i === 0 }));
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

// Apply a choice's light effects to the game state. Returns a new SaveGame.
export function applyEventEffects(state: SaveGame, effects: EventEffects | undefined): SaveGame {
  if (!effects) return state;
  const p = state.player;
  const w = p.wellbeing;
  const s = p.standing;
  const f = p.funds;
  const e = p.expertise;
  return {
    ...state,
    player: {
      ...p,
      wellbeing: {
        sleep: clamp(w.sleep + (effects.sleep ?? 0)),
        mood: clamp(w.mood + (effects.mood ?? 0)),
        physical: clamp(w.physical + (effects.physical ?? 0)),
        stress: clamp(w.stress + (effects.stress ?? 0)),
      },
      standing: {
        ...s,
        reputation: Math.max(0, s.reputation + (effects.reputation ?? 0)),
        affiliation_prestige: clamp(s.affiliation_prestige + (effects.affiliation_prestige ?? 0)),
      },
      funds: {
        personal: f.personal + (effects.personal_funds ?? 0),
        research: f.research + (effects.research_funds ?? 0),
      },
      expertise: {
        methods: Math.max(0, e.methods + (effects.methods ?? 0)),
        theory: Math.max(0, e.theory + (effects.theory ?? 0)),
        writing: Math.max(0, e.writing + (effects.writing ?? 0)),
        statistics: Math.max(0, e.statistics + (effects.statistics ?? 0)),
        teaching: Math.max(0, e.teaching + (effects.teaching ?? 0)),
        politics: Math.max(0, e.politics + (effects.politics ?? 0)),
      },
    },
  };
}
