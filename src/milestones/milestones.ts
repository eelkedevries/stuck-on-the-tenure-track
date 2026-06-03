// Milestone framework (specification §4.10).
//
// Four milestones structure the career and can each be failed, with
// consequences. This module provides the generic gate: a readiness score versus
// a per-milestone threshold, resolved with a stochastic component. The detailed
// tenure-decision logic is `049`, and the CV screen is `060`. Functions return
// new values; inputs are not mutated.

import type { SaveGame } from '../state/save';

export type MilestoneId =
  | 'bachelor_diploma'
  | 'msc_defence'
  | 'phd_defence'
  | 'assistant_professor'
  | 'tenure_decision';

export const MILESTONES: readonly MilestoneId[] = [
  'bachelor_diploma',
  'msc_defence',
  'phd_defence',
  'assistant_professor',
  'tenure_decision',
];

// Readiness thresholds, rising with career stage.
const THRESHOLDS: Record<MilestoneId, number> = {
  bachelor_diploma: 10,
  msc_defence: 20,
  phd_defence: 45,
  assistant_professor: 70,
  tenure_decision: 100,
};

export const FAILURE_REPUTATION_PENALTY = 10;

export interface MilestonePresentation {
  title: string;
  achieved: string;
  next: string;
  meaning: string;
}

export const MILESTONE_PRESENTATION: Record<MilestoneId, MilestonePresentation> = {
  bachelor_diploma: {
    title: "Bachelor's diploma awarded",
    achieved: "You earned the Bachelor's diploma, with only the expected amount of ceremonial paperwork.",
    next: "Next: Master's student.",
    meaning: "The career tracker now expects advanced coursework and a Master's thesis rather than undergraduate survival.",
  },
  msc_defence: {
    title: "Master's diploma awarded",
    achieved: "You completed the Master's thesis and received the diploma, probably after refreshing the portal several times.",
    next: 'Next: PhD student.',
    meaning: 'Research output now matters more: publications and a dissertation begin to define progress.',
  },
  phd_defence: {
    title: 'PhD dissertation defended',
    achieved: 'You defended the dissertation. The committee agreed it was a dissertation, which is the important part.',
    next: 'Next: postdoc.',
    meaning: 'You are now judged less as a student and more as a future colleague with papers, grants, and visible independence.',
  },
  assistant_professor: {
    title: 'Assistant-professor post secured',
    achieved: 'You converted temporary contracts into a more permanent temporary pressure system.',
    next: 'Next: the tenure file.',
    meaning: 'Teaching, service, grants, publications, and reputation now feed the long-term tenure decision.',
  },
  tenure_decision: {
    title: 'Tenure review completed',
    achieved: 'The committee reached a decision, after the traditional interval of institutional opacity.',
    next: 'Next: the end-game CV.',
    meaning: 'This is the existing endpoint of the beta career arc.',
  },
};


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
