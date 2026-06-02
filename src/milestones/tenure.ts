// Tenure decision and win condition (specification §4.10).
//
// The committee weighs publications, citations, grants, teaching, and service,
// with a stochastic component, so strong candidates are usually — but not
// always — promoted, and weak ones occasionally are. The win condition is the
// first tenured offer in the cohort. The CV screen (`060`) and post-tenure
// gameplay (§9) are out of scope. Functions return new values; inputs are not
// mutated.

import type { SaveGame } from '../state/save';
import type { Paper } from '../papers/types';
import type { Rival } from '../rivals/simulation';
import { hIndex } from '../papers/hindex';

export const TENURE_THRESHOLD = 100;

function papersOf(state: SaveGame): Paper[] {
  return state.player.papers as unknown as Paper[];
}

// A weighted score across the committee's criteria.
export function tenureScore(state: SaveGame): number {
  const papers = papersOf(state);
  const publications = papers.length;
  const citations = papers.reduce((sum, p) => sum + (p.citations ?? 0), 0);
  const grants = state.player.grants_held.length;
  const teaching = state.player.expertise.teaching;
  const service = state.player.expertise.politics;
  return (
    publications * 3 +
    hIndex(papers) * 5 +
    citations * 0.2 +
    grants * 8 +
    teaching * 1 +
    service * 1 +
    state.player.standing.reputation * 0.5
  );
}

// Probability of a tenure offer, squashed into (0.05, 0.95) so the outcome is
// partly stochastic in both directions.
export function tenureProbability(state: SaveGame): number {
  const margin = tenureScore(state) - TENURE_THRESHOLD;
  return Math.max(0.05, Math.min(0.95, 0.5 + margin / 100));
}

export interface TenureDecision {
  offered: boolean;
  score: number;
  probability: number;
}

export function decideTenure(state: SaveGame, rng: () => number = Math.random): TenureDecision {
  const probability = tenureProbability(state);
  return { offered: rng() < probability, score: tenureScore(state), probability };
}

// Apply a tenure offer: promote to tenured and record the milestone. The turn
// engine's resolution phase ends the game once the player is tenured.
export function applyTenure(state: SaveGame): SaveGame {
  const milestones_completed = state.player.milestones_completed.includes('tenure_decision')
    ? state.player.milestones_completed
    : [...state.player.milestones_completed, 'tenure_decision'];
  return {
    ...state,
    player: {
      ...state.player,
      standing: { ...state.player.standing, rank: 'tenured' },
      milestones_completed,
    },
  };
}

// The win condition: the player is tenured and no rival reached tenure first.
export function winConditionMet(state: SaveGame, rivals: Rival[]): boolean {
  return state.player.standing.rank === 'tenured' && rivals.every((r) => r.rank !== 'tenured');
}
