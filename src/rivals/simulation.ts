// Rival simulation (specification §4.9).
//
// Three scripted stochastic rivals advance in parallel each turn according to
// their archetype. A rival carries public outputs and hidden private state; the
// public cohort tracker (`047`) decides what is shown. Randomness is injectable
// for determinism. No runtime LLM is used (specification §9).

import type { Rank } from '../state/types';
import type { RivalArchetype } from './archetypes';
import { RIVAL_PROFILES } from './archetypes';

export interface Rival {
  rival_id: string;
  name: string;
  archetype: RivalArchetype;
  // Public outputs.
  rank: Rank;
  publications: number;
  h_index: number;
  affiliation_prestige: number;
  recent_event: string | null;
  // Hidden private state — not exposed by the cohort tracker.
  wellbeing: number;
  committed_misconduct: boolean;
}

// Advance one rival by one turn. Output varies around the archetype's mean by
// its variance; quality drives h-index growth; networking lifts prestige; risk
// occasionally leads to misconduct; wellbeing erodes.
export function advanceRival(rival: Rival, rng: () => number = Math.random): Rival {
  const profile = RIVAL_PROFILES[rival.archetype];
  const swing = Math.max(0, 1 + (rng() * 2 - 1) * profile.variance);
  const newPapers = Math.round(profile.outputRate * swing);
  const publications = rival.publications + newPapers;
  const h_index = Math.min(
    publications,
    Math.round(rival.h_index + profile.quality * newPapers * 0.5),
  );
  const affiliation_prestige = Math.min(
    100,
    rival.affiliation_prestige + Math.round(profile.networking),
  );
  const committed_misconduct = rival.committed_misconduct || rng() < profile.riskTaking * 0.1;
  const wellbeing = Math.max(0, rival.wellbeing - 1);
  const recent_event =
    newPapers >= 3 ? 'a flurry of new papers' : newPapers === 0 ? 'a quiet term' : rival.recent_event;

  return {
    ...rival,
    publications,
    h_index,
    affiliation_prestige,
    committed_misconduct,
    wellbeing,
    recent_event,
  };
}

// Advance all rivals (typically three) in parallel for the turn.
export function simulateRivals(rivals: Rival[], rng: () => number = Math.random): Rival[] {
  return rivals.map((rival) => advanceRival(rival, rng));
}
