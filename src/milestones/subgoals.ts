// Stage-specific sub-goals (specification §3, §4.1; prompt 095).
//
// Each career stage has a concrete sub-goal made of measurable criteria read
// from game state, so the player can see exactly what they are working toward
// now (separate from the long-game tenure bar). Progress is the average of each
// criterion's completion. The sub-goal does not gate stage advancement; it
// reflects how well the player is meeting the stage's real demands.

import type { SaveGame } from '../state/save';
import type { Paper } from '../papers/types';
import { stageForTurn } from '../calendar/stages';

export interface Criterion {
  label: string;
  current: number;
  target: number;
}

export interface SubGoal {
  title: string;
  criteria: Criterion[];
}

function publishedCount(state: SaveGame): number {
  return (state.player.papers as unknown as Paper[]).filter((p) => p.status === 'published').length;
}

export function subGoalFor(state: SaveGame): SubGoal {
  const e = state.player.expertise;
  const standing = state.player.standing;
  const pubs = publishedCount(state);
  const grants = state.player.grants_held.length;

  switch (stageForTurn(state.calendar.turn_number)) {
    case 'undergraduate':
      return {
        title: "your Bachelor's degree",
        criteria: [
          { label: 'Foundational theory', current: e.theory, target: 12 },
          { label: 'Research methods', current: e.methods, target: 10 },
          { label: 'Statistics', current: e.statistics, target: 8 },
          { label: 'Bachelor thesis', current: e.writing, target: 8 },
        ],
      };
    case 'msc':
      return {
        title: "your Master's degree",
        criteria: [
          { label: 'Advanced theory', current: e.theory, target: 20 },
          { label: 'Advanced methods', current: e.methods, target: 18 },
          { label: 'Advanced statistics', current: e.statistics, target: 15 },
          { label: "Master's thesis", current: e.writing, target: 14 },
        ],
      };
    case 'phd':
      return {
        title: 'your PhD',
        criteria: [
          { label: 'Publications', current: pubs, target: 3 },
          { label: 'Methods mastery', current: e.methods, target: 25 },
          { label: 'Dissertation', current: e.writing, target: 18 },
        ],
      };
    case 'postdoc':
      return {
        title: 'a faculty job',
        criteria: [
          { label: 'Publication record', current: pubs, target: 7 },
          { label: 'Grant won', current: grants, target: 1 },
          { label: 'Reputation', current: standing.reputation, target: 35 },
        ],
      };
    case 'assistant_professor':
    default:
      return {
        title: 'tenure',
        criteria: [
          { label: 'Publications', current: pubs, target: 14 },
          { label: 'Grants', current: grants, target: 2 },
          { label: 'Teaching', current: e.teaching, target: 18 },
          { label: 'Service', current: e.politics, target: 14 },
        ],
      };
  }
}

export function subGoalProgress(goal: SubGoal): number {
  if (goal.criteria.length === 0) return 0;
  const sum = goal.criteria.reduce(
    (acc, c) => acc + (c.target > 0 ? Math.min(1, c.current / c.target) : 1),
    0,
  );
  return Math.round((sum / goal.criteria.length) * 100);
}

export function criterionMet(c: Criterion): boolean {
  return c.current >= c.target;
}
