// Public cohort tracker (specification §4.9).
//
// The tracker exposes rivals' public outputs only — rank, publications,
// h-index, institution prestige, and major recent events. Private wellbeing,
// relationships, and misconduct are never exposed. UI rendering is `058`.

import type { Rank } from '../state/types';
import type { Rival } from './simulation';

export interface CohortEntry {
  rival_id: string;
  name: string;
  rank: Rank;
  publications: number;
  h_index: number;
  affiliation_prestige: number;
  recent_event: string | null;
}

// Project a rival to its public view, dropping all private fields.
export function publicView(rival: Rival): CohortEntry {
  return {
    rival_id: rival.rival_id,
    name: rival.name,
    rank: rival.rank,
    publications: rival.publications,
    h_index: rival.h_index,
    affiliation_prestige: rival.affiliation_prestige,
    recent_event: rival.recent_event,
  };
}

// The public cohort tracker: public views of all rivals.
export function cohortTracker(rivals: Rival[]): CohortEntry[] {
  return rivals.map(publicView);
}
