// Career-stage turn budget (specification §3).
//
// Turn duration varies by career stage so short early stages and longer later
// stages both fit into a ~25-turn game. Each stage contributes a number of
// turns, and each of its turns advances the calendar by a fixed number of
// months.

import type { Calendar } from '../state/save';
import type { Rank } from '../state/types';
import { advanceCalendar } from './calendar';

export type Stage =
  | 'undergraduate'
  | 'msc'
  | 'phd'
  | 'postdoc'
  | 'assistant_professor';

export interface StageBudget {
  stage: Stage;
  turns: number;
  monthsPerTurn: number;
}

// Subject to playtesting (specification §3). Totals ~25 turns over ~18 years.
export const STAGE_BUDGET: readonly StageBudget[] = [
  { stage: 'undergraduate', turns: 3, monthsPerTurn: 12 },
  { stage: 'msc', turns: 2, monthsPerTurn: 12 },
  { stage: 'phd', turns: 8, monthsPerTurn: 6 },
  { stage: 'postdoc', turns: 6, monthsPerTurn: 6 },
  { stage: 'assistant_professor', turns: 6, monthsPerTurn: 12 },
];

export function totalTurns(): number {
  return STAGE_BUDGET.reduce((sum, b) => sum + b.turns, 0);
}

export function monthsPerTurn(stage: Stage): number {
  const budget = STAGE_BUDGET.find((b) => b.stage === stage);
  if (!budget) throw new Error(`Unknown stage: ${stage}`);
  return budget.monthsPerTurn;
}

// The stage a given zero-based turn index falls in (turn 0 is the first turn).
export function stageForTurn(turnIndex: number): Stage {
  let cursor = 0;
  for (const budget of STAGE_BUDGET) {
    cursor += budget.turns;
    if (turnIndex < cursor) return budget.stage;
  }
  return STAGE_BUDGET[STAGE_BUDGET.length - 1].stage;
}


export function rankForTurn(turnIndex: number): Rank {
  return stageForTurn(turnIndex);
}

// Fraction (0..1) through the current stage by turns, for the sub-goal bar.
export function stageProgress(turnIndex: number): number {
  let start = 0;
  for (const budget of STAGE_BUDGET) {
    if (turnIndex < start + budget.turns) {
      return Math.min(1, (turnIndex - start + 1) / budget.turns);
    }
    start += budget.turns;
  }
  return 1;
}

// Advance one turn within the given stage, moving the date by that stage's
// per-turn interval and incrementing the turn number.
export function advanceTurn(calendar: Calendar, stage: Stage): Calendar {
  return advanceCalendar(calendar, { months: monthsPerTurn(stage) });
}
