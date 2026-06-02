// Event selection (specification §2, §4.2; prompt 076).
//
// Chooses a turn's events from the resolved content events using the current
// context — career stage, the action categories the player just leaned into,
// and which events have already been seen. Selection is data-driven (it matches
// event conditions and tags); no specific events are hardcoded. Presentation is
// handled by the UI layer, which shows the selected events through EventScreen
// and records resolutions in `events_history`.

import type { ContentEvent } from '../content/types';
import type { Stage } from '../calendar/stages';
import type { ActionCategory } from './actions';

// Structurally identical to EventScreen's EventEntry, so the result can be
// passed straight to that component without importing from a .svelte file.
export interface SelectedEvent {
  event: ContentEvent;
  mandatory: boolean;
}

export interface EventContext {
  stage: Stage;
  recentCategories: ActionCategory[];
  seenEventIds: string[];
  rng?: () => number;
}

// Maximum events surfaced in a turn: one mandatory plus up to two optional.
const MAX_EVENTS = 3;

// An event is eligible if its declared conditions match the context. Unknown
// condition keys are ignored so authoring can add gates incrementally.
function eligible(event: ContentEvent, ctx: EventContext): boolean {
  const conditions = event.conditions;
  if (!conditions) return true;
  if (typeof conditions.stage === 'string' && conditions.stage !== ctx.stage) {
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
