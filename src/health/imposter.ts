// Imposter subsystem (specification §4.7).
//
// Tracks perceived competence, actual competence, and their gap. When the gap
// is large (the player feels far less competent than they are), opportunities
// can be auto-declined. Health conditions (`040`) and specific opportunity
// events are handled elsewhere. The `ImposterState` shape is in
// `../state/types`. All values are clamped to 0..100.

import type { ImposterState } from '../state/types';

export const COMPETENCE_MIN = 0;
export const COMPETENCE_MAX = 100;

// Gap at or above this auto-declines an opportunity.
export const AUTO_DECLINE_GAP = 30;

function clamp(value: number): number {
  return Math.max(COMPETENCE_MIN, Math.min(COMPETENCE_MAX, value));
}

export function createImposterState(
  actualCompetence = 50,
  perceivedCompetence = 50,
): ImposterState {
  return {
    actual_competence: clamp(actualCompetence),
    perceived_competence: clamp(perceivedCompetence),
  };
}

// The imposter gap: how far perceived competence falls short of actual. A large
// positive gap means the player underrates themselves.
export function imposterGap(state: ImposterState): number {
  return state.actual_competence - state.perceived_competence;
}

// Whether an opportunity should be auto-declined given the current gap.
export function shouldAutoDecline(
  state: ImposterState,
  threshold: number = AUTO_DECLINE_GAP,
): boolean {
  return imposterGap(state) >= threshold;
}

export interface ImposterDeltas {
  perceived?: number;
  actual?: number;
}

export function adjustImposter(state: ImposterState, deltas: ImposterDeltas = {}): ImposterState {
  return {
    actual_competence: clamp(state.actual_competence + (deltas.actual ?? 0)),
    perceived_competence: clamp(state.perceived_competence + (deltas.perceived ?? 0)),
  };
}
