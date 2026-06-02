// Misconduct detection (specification §4.8).
//
// Detection probability rises with visibility, co-authors, data sharing, time
// since publication, whistleblower risk, and random scrutiny. Detection
// triggers retraction and the loss of the paper's citations (so the h-index
// drops), plus a reputation penalty. The model and penalties are calibrated so
// that, across a career, a misconduct strategy has non-positive expected value.

import type { Paper } from './types';
import { retract } from './lifecycle';

export interface DetectionFactors {
  visibility: number; // paper visibility
  coAuthors: number; // number of co-authors besides the player
  openData: boolean; // shared data makes scrutiny easier
  whistleblowerRisk: number; // 0..1
  yearsSincePublication: number;
}

const BASE_ANNUAL: Record<'grey' | 'outright', number> = {
  grey: 0.02,
  outright: 0.06,
};

// Probability of detection in a single year given the current factors. Clean
// papers are never "detected". Outright misconduct is riskier than grey.
export function detectionProbability(paper: Paper, factors: DetectionFactors): number {
  if (paper.contains_misconduct === 'none') return 0;
  const base = BASE_ANNUAL[paper.contains_misconduct];
  const p =
    base +
    factors.visibility * 0.001 +
    factors.coAuthors * 0.01 +
    (factors.openData ? 0.05 : 0) +
    Math.min(factors.yearsSincePublication, 5) * 0.005 +
    factors.whistleblowerRisk * 0.1;
  return Math.max(0, Math.min(1, p));
}

// Cumulative probability that misconduct is caught within `years`.
export function lifetimeDetectionProbability(
  paper: Paper,
  factors: DetectionFactors,
  years: number,
): number {
  let survives = 1;
  for (let year = 1; year <= years; year += 1) {
    survives *= 1 - detectionProbability(paper, { ...factors, yearsSincePublication: year });
  }
  return 1 - survives;
}

export interface DetectionRoll {
  probability: number;
  detected: boolean;
}

export function rollDetection(
  paper: Paper,
  factors: DetectionFactors,
  rng: () => number = Math.random,
): DetectionRoll {
  const probability = detectionProbability(paper, factors);
  return { probability, detected: rng() < probability };
}

export const REPUTATION_PENALTY = 25;

// Consequence of detection on the paper: retraction and loss of its citations,
// which drops the h-index. Returns a new paper.
export function applyDetectionToPaper(paper: Paper, date: string): Paper {
  const retracted = paper.status === 'published' ? retract(paper, date) : paper;
  return { ...retracted, citations: 0 };
}

// Reputation after a detection event, floored at zero.
export function applyReputationPenalty(reputation: number): number {
  return Math.max(0, reputation - REPUTATION_PENALTY);
}

// Expected-value model for committing misconduct. The benefit is realised only
// if undetected; detection forfeits it and imposes a heavy penalty. Calibrated
// so the expected value is non-positive once detection risk is realistic.
export const MISCONDUCT_BENEFIT = 12;
export const DETECTION_PENALTY = 120;

export function misconductExpectedValue(
  detectionProbability: number,
  benefit: number = MISCONDUCT_BENEFIT,
  penalty: number = DETECTION_PENALTY,
): number {
  return benefit * (1 - detectionProbability) - penalty * detectionProbability;
}
