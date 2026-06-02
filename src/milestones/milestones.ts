// Milestone framework (specification §4.10).
//
// Four milestones structure the career and can each be failed, with
// consequences. This module provides the generic gate: a readiness score versus
// a per-milestone threshold, resolved with a stochastic component. The detailed
// tenure-decision logic is `049`, and the CV screen is `060`. Functions return
// new values; inputs are not mutated.

import type { SaveGame } from '../state/save';

export type MilestoneId =
  | 'msc_defence'
  | 'phd_defence'
  | 'assistant_professor'
  | 'tenure_decision';

export const MILESTONES: readonly MilestoneId[] = [
  'msc_defence',
  'phd_defence',
  'assistant_professor',
  'tenure_decision',
];

// Readiness thresholds, rising with career stage.
const THRESHOLDS: Record<MilestoneId, number> = {
  msc_defence: 20,
  phd_defence: 45,
  assistant_professor: 70,
  tenure_decision: 100,
};

export const FAILURE_REPUTATION_PENALTY = 10;

function expertiseTotal(state: SaveGame): number {
  const e = state.player.expertise;
  return e.methods + e.theory + e.writing + e.statistics + e.teaching + e.politics;
}

// A generic readiness score from expertise, publication count, and reputation.
export function readiness(state: SaveGame): number {
  return expertiseTotal(state) + state.player.papers.length * 5 + state.player.standing.reputation;
}

// Probability of passing a milestone: how far readiness exceeds the threshold,
// squashed into (0.05, 0.95) so strong candidates usually — but not always —
// pass and weak ones occasionally scrape through.
export function passProbability(state: SaveGame, milestone: MilestoneId): number {
  const margin = readiness(state) - THRESHOLDS[milestone];
  const p = 0.5 + margin / 100;
  return Math.max(0.05, Math.min(0.95, p));
}

export interface MilestoneResult {
  milestone: MilestoneId;
  passed: boolean;
  probability: number;
}

// Attempt a milestone. Stochastic: inject `rng` for determinism.
export function attemptMilestone(
  state: SaveGame,
  milestone: MilestoneId,
  rng: () => number = Math.random,
): MilestoneResult {
  const probability = passProbability(state, milestone);
  return { milestone, passed: rng() < probability, probability };
}

// Record a passed milestone on the player.
export function recordMilestone(state: SaveGame, milestone: MilestoneId): SaveGame {
  if (state.player.milestones_completed.includes(milestone)) return state;
  return {
    ...state,
    player: {
      ...state.player,
      milestones_completed: [...state.player.milestones_completed, milestone],
    },
  };
}

// Apply the consequence of failing a milestone (a reputation hit).
export function applyMilestoneFailure(state: SaveGame): SaveGame {
  return {
    ...state,
    player: {
      ...state.player,
      standing: {
        ...state.player.standing,
        reputation: Math.max(0, state.player.standing.reputation - FAILURE_REPUTATION_PENALTY),
      },
    },
  };
}
