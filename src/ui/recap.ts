// End-of-turn diary (specification §4.2, §5; prompt 081).
//
// Builds a concise, dry recap of a turn from the before/after game state and the
// turn's inputs. Everything is derived from recorded state with light templated
// phrasing — no bespoke per-situation prose. Returns recap lines for the diary
// screen to render.

import type { SaveGame } from '../state/save';
import type { Allocation, ActionCategory } from '../engine/actions';
import { ACTION_CATEGORIES } from '../engine/actions';
import type { Paper } from '../papers/types';
import type { Npc } from '../relationships/types';
import type { Deadline } from '../deadlines/types';
import { LOCATIONS, type LocationId } from '../locations/types';
import { hIndex } from '../papers/hindex';

const LABELS: Record<ActionCategory, string> = {
  research: 'research',
  teaching: 'teaching',
  service: 'service',
  networking: 'networking',
  funding: 'grant-writing',
  personal: 'personal time',
  misconduct: 'cutting corners',
};

export interface RecapInput {
  before: SaveGame;
  after: SaveGame;
  allocation: Allocation;
  movementSpent: number;
  eventTitles: string[];
}

export interface Recap {
  turn: number;
  lines: string[];
}

function publishedCount(state: SaveGame): number {
  return (state.player.papers as unknown as Paper[]).filter((p) => p.status === 'published').length;
}

function endedCount(state: SaveGame): number {
  return (state.player.relationships as unknown as Npc[]).filter(
    (n) => n.relationship_status === 'ended',
  ).length;
}

export function buildRecap(input: RecapInput): Recap {
  const { before, after, allocation, movementSpent, eventTitles } = input;
  const turnNo = before.calendar.turn_number;
  const lines: string[] = [];

  // Movement.
  const visited = after.player.location_visits
    .filter((v) => v.turn === turnNo)
    .map((v) => LOCATIONS[v.location as LocationId].name);
  const path = [...new Set(visited)];
  if (path.length <= 1) {
    lines.push(`Stayed put in the ${path[0] ?? 'office'}.`);
  } else {
    lines.push(`Did the rounds: ${path.join(' → ')}.`);
  }
  if (movementSpent > 0) lines.push(`Lost ${movementSpent} time to getting about.`);

  // Actions.
  const cats = ACTION_CATEGORIES.filter((c) => allocation[c] > 0).sort(
    (a, b) => allocation[b] - allocation[a],
  );
  if (cats.length > 0) {
    const top = cats[0];
    const tail = cats[1] ? `, with some ${LABELS[cats[1]]} (${allocation[cats[1]]})` : '';
    lines.push(`Spent the turn on ${LABELS[top]} (${allocation[top]})${tail}.`);
  } else {
    lines.push('Frittered the turn away on nothing in particular.');
  }

  // Events.
  if (eventTitles.length > 0) lines.push(`Dealt with: ${eventTitles.join('; ')}.`);

  // Deadlines resolved this turn.
  const beforeStatus = new Map(
    (before.deadlines as unknown as Deadline[]).map((d) => [d.deadline_id, d.status]),
  );
  for (const d of after.deadlines as unknown as Deadline[]) {
    if (beforeStatus.get(d.deadline_id) === 'pending' && d.status === 'met') {
      lines.push(`Met: ${d.title}.`);
    } else if (beforeStatus.get(d.deadline_id) === 'pending' && d.status === 'missed') {
      lines.push(`Missed: ${d.title}.`);
    }
  }

  // Outputs.
  const pubDelta = publishedCount(after) - publishedCount(before);
  if (pubDelta > 0) lines.push(`Published ${pubDelta} paper${pubDelta === 1 ? '' : 's'}.`);
  const grantDelta = after.player.grants_held.length - before.player.grants_held.length;
  if (grantDelta > 0) lines.push('Landed a grant. The relief is taxable.');
  const hDelta = hIndex(after.player.papers as unknown as Paper[]) - hIndex(before.player.papers as unknown as Paper[]);
  if (hDelta > 0) lines.push(`h-index up to ${hIndex(after.player.papers as unknown as Paper[])}.`);

  // Wellbeing and relationships.
  if (after.player.wellbeing.sleep < before.player.wellbeing.sleep) {
    lines.push(after.player.wellbeing.sleep < 30 ? 'Slept badly; it shows.' : 'Slept a little worse.');
  }
  const endedDelta = endedCount(after) - endedCount(before);
  if (endedDelta > 0) {
    lines.push(`${endedDelta} relationship${endedDelta === 1 ? '' : 's'} quietly fell away.`);
  }
  const repDelta = after.player.standing.reputation - before.player.standing.reputation;
  if (repDelta <= -3) lines.push('Reputation took a knock.');

  // Rivals.
  const flurry = (after.rivals as unknown as { recent_event: string | null }[]).some(
    (r) => r.recent_event === 'a flurry of new papers',
  );
  if (flurry) lines.push('A rival has been publishing again. Of course they have.');

  return { turn: turnNo, lines };
}
