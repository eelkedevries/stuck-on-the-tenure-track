// End-of-turn diary (specification §4.2, §5; prompts 081, 102).
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
import { MILESTONE_PRESENTATION, type MilestoneId, type MilestonePresentation } from '../milestones/milestones';
import { stageForTurn } from '../calendar/stages';

export interface RecapInput {
  before: SaveGame;
  after: SaveGame;
  allocation: Allocation;
  movementSpent: number;
  eventTitles: string[];
  rivalLine?: string | null;
  missedAppointments?: string[];
  progressBefore?: number;
  progressAfter?: number;
}

const FOCUS_LINES: Record<ActionCategory, string[]> = {
  research: [
    'Research moved from aspirational tab to actual workbench.',
    'The literature did not become smaller, but at least you looked it in the eye.',
  ],
  teaching: [
    'Students received preparation rather than vibes. A controversial intervention.',
    'Teaching prep advanced, and only some of it was improvisational theatre.',
  ],
  service: [
    'Service consumed time and produced minutes, which academia insists are different things.',
    'A committee was fed. It may return tomorrow.',
  ],
  networking: [
    'Visibility improved through the traditional method: being seen near biscuits.',
    'You reminded people you exist, which remains a recognised career strategy.',
  ],
  funding: [
    'The grant document became marginally less fictional.',
    'A funder portal accepted more of your life force.',
  ],
  personal: [
    'Recovery happened on purpose, not as a browser crash.',
    'You treated rest as maintenance rather than a character flaw.',
  ],
  misconduct: [
    'Corners were cut. The corner industry applauds.',
    'The shortcut looked efficient, which is how shortcuts get you.',
  ],
};

const SATIRE_LINES = [
  'The institution thanked you by sending another email.',
  'Several systems became aware of your effort and chose silence.',
  'Somewhere, a spreadsheet felt briefly nourished.',
  'The academic machine accepted the offering and requested a PDF.',
  'Progress occurred, pending committee recognition.',
];

export interface Recap {
  turn: number;
  lines: string[];
  majorMilestones: MilestonePresentation[];
}


function majorMilestones(before: SaveGame, after: SaveGame): MilestonePresentation[] {
  const beforeStage = stageForTurn(before.calendar.turn_number);
  const afterStage = stageForTurn(after.calendar.turn_number);
  if (beforeStage === afterStage) return [];
  const milestoneByCompletedStage: Partial<Record<typeof beforeStage, MilestoneId>> = {
    undergraduate: 'bachelor_diploma',
    msc: 'msc_defence',
    phd: 'phd_defence',
  };
  const milestone = milestoneByCompletedStage[beforeStage];
  return milestone ? [MILESTONE_PRESENTATION[milestone]] : [];
}

function daysUntil(fromISO: string, toISO: string): number {
  const ms =
    Date.parse(`${toISO}T00:00:00Z`) - Date.parse(`${fromISO}T00:00:00Z`);
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

function publishedCount(state: SaveGame): number {
  return (state.player.papers as unknown as Paper[]).filter(
    (p) => p.status === 'published',
  ).length;
}

function endedCount(state: SaveGame): number {
  return (state.player.relationships as unknown as Npc[]).filter(
    (n) => n.relationship_status === 'ended',
  ).length;
}

function strongestChange(before: SaveGame, after: SaveGame): string | null {
  const deltas = [
    {
      amount: after.player.expertise.methods - before.player.expertise.methods,
      line: 'Methods crept upward; the lab book looks fractionally less accusatory.',
    },
    {
      amount: after.player.expertise.writing - before.player.expertise.writing,
      line: 'Writing improved, mostly by putting words where dread used to be.',
    },
    {
      amount:
        after.player.expertise.teaching - before.player.expertise.teaching,
      line: 'Teaching confidence rose; pedagogical panic is now slightly better formatted.',
    },
    {
      amount:
        after.player.expertise.politics - before.player.expertise.politics,
      line: 'Academic politics skill increased, which is a sentence nobody should enjoy.',
    },
    {
      amount:
        after.player.standing.reputation - before.player.standing.reputation,
      line: 'Reputation ticked up; someone important may have nodded near you.',
    },
  ].filter((d) => d.amount > 0);

  return deltas.sort((a, b) => b.amount - a.amount)[0]?.line ?? null;
}

function visibleSetback(before: SaveGame, after: SaveGame): string | null {
  const stressDelta =
    after.player.wellbeing.stress - before.player.wellbeing.stress;
  if (stressDelta >= 8)
    return 'Stress climbed; the calendar is developing jump-scare mechanics.';
  if (after.player.wellbeing.sleep < before.player.wellbeing.sleep - 3) {
    return 'Sleep slipped, and the inbox noticed weakness.';
  }
  const repDelta =
    after.player.standing.reputation - before.player.standing.reputation;
  if (repDelta <= -2)
    return 'Reputation took a knock. The corridor has excellent acoustics.';
  const endedDelta = endedCount(after) - endedCount(before);
  if (endedDelta > 0) {
    return `${endedDelta} relationship${endedDelta === 1 ? '' : 's'} quietly fell off the calendar.`;
  }
  return null;
}

function readableConsequence(
  input: RecapInput,
  top: ActionCategory | undefined,
): string {
  const {
    before,
    after,
    allocation,
    eventTitles,
    missedAppointments = [],
  } = input;
  const totalWork =
    allocation.research +
    allocation.teaching +
    allocation.service +
    allocation.networking +
    allocation.funding;
  const urgent = (before.deadlines as unknown as Deadline[]).filter(
    (d) =>
      d.status === 'pending' &&
      daysUntil(before.calendar.current_date, d.due_date) <= 270,
  );

  if (missedAppointments.length > 0) {
    return `Missed ${missedAppointments[0]}; the diary calls it a scheduling choice for legal reasons.`;
  }

  const beforeStatus = new Map(
    (before.deadlines as unknown as Deadline[]).map((d) => [
      d.deadline_id,
      d.status,
    ]),
  );
  const resolved = (after.deadlines as unknown as Deadline[]).find(
    (d) =>
      beforeStatus.get(d.deadline_id) === 'pending' && d.status !== 'pending',
  );
  if (resolved?.status === 'met')
    return `Met ${resolved.title}; the deadline has been temporarily domesticated.`;
  if (resolved?.status === 'missed')
    return `Missed ${resolved.title}; consequences have entered the chat.`;

  const pubDelta = publishedCount(after) - publishedCount(before);
  if (pubDelta > 0)
    return `A paper made it into print. The CV has acquired another barnacle.`;

  const grantDelta =
    after.player.grants_held.length - before.player.grants_held.length;
  if (grantDelta > 0)
    return 'A grant landed. Relief arrived with reporting requirements attached.';

  if (urgent.length > 0 && totalWork < 20)
    return `${urgent[0].title} still looms. Avoidance remains undefeated.`;
  if (urgent.length > 0 && top === 'personal')
    return `${urgent[0].title} is close enough to appear in dreams; you chose recovery anyway.`;
  if (top === 'personal' && totalWork >= 20)
    return 'You made some career progress, then spent the remaining day on recovery before the machinery noticed.';
  if (top && allocation[top] >= 45) return FOCUS_LINES[top][0];
  if (top) return FOCUS_LINES[top][1];
  if (eventTitles.length > 0)
    return `Handled ${eventTitles[0]}; admin filed it under character development.`;
  return 'The turn passed without a headline, which is also how careers happen.';
}

function progressLine(input: RecapInput): string {
  const { before, after, progressBefore, progressAfter } = input;
  const hBefore = hIndex(before.player.papers as unknown as Paper[]);
  const hAfter = hIndex(after.player.papers as unknown as Paper[]);
  if (hAfter > hBefore)
    return `Progress: h-index rose to ${hAfter}. Try not to say the number out loud.`;

  const setback = visibleSetback(before, after);
  if (setback) return `Setback: ${setback}`;

  if (progressBefore != null && progressAfter != null) {
    if (progressAfter > progressBefore)
      return `Progress: current goal moved from ${progressBefore}% to ${progressAfter}%.`;
    if (progressAfter < progressBefore)
      return `Setback: current goal slipped from ${progressBefore}% to ${progressAfter}%.`;
  }

  const change = strongestChange(before, after);
  if (change) return `Progress: ${change}`;

  return 'Progress: nothing obvious moved, but at least the save file believes you were here.';
}

function satireLine(allocation: Allocation): string {
  const totalWork =
    allocation.research +
    allocation.teaching +
    allocation.service +
    allocation.networking +
    allocation.funding;
  if (totalWork >= 90)
    return 'The work-life balance committee has opened an investigation.';
  if (allocation.personal >= 60)
    return 'Rest was logged as strategic resilience, because academia respects jargon.';
  if (allocation.networking >= 35)
    return 'You converted small talk into invisible capital, the worst kind of alchemy.';
  if (allocation.funding >= 35)
    return 'The budget justification was, spiritually, a cry for help.';
  return SATIRE_LINES[totalWork % SATIRE_LINES.length];
}

export function buildRecap(input: RecapInput): Recap {
  const { before, after, allocation, movementSpent, eventTitles, rivalLine } =
    input;
  const turnNo = before.calendar.turn_number;
  const lines: string[] = [];

  const cats = ACTION_CATEGORIES.filter((c) => allocation[c] > 0).sort(
    (a, b) => allocation[b] - allocation[a],
  );
  const top = cats[0];

  // One concrete consequence of the player's time use.
  lines.push(readableConsequence(input, top));

  // One dry satirical line.
  lines.push(satireLine(allocation));

  // One rival/cohort line when available.
  if (rivalLine) lines.push(`Cohort watch: ${rivalLine}`);

  // One visible progress or setback line.
  lines.push(progressLine(input));

  // Keep a compact travel/event footnote only when it adds useful context.
  const visited = after.player.location_visits
    .filter((v) => v.turn === turnNo)
    .map((v) => LOCATIONS[v.location as LocationId].name);
  const path = [...new Set(visited)];
  if (path.length > 2) lines.push(`Route: ${path.join(' → ')}.`);
  else if (movementSpent >= 20)
    lines.push(
      'Route: a surprising amount of the turn was walking between obligations.',
    );

  if (eventTitles.length > 0)
    lines.push(`Filed away: ${eventTitles.join('; ')}.`);

  return { turn: turnNo, lines, majorMilestones: majorMilestones(before, after) };
}
