// Grant call scheduling and eligibility (specification §4.4, §3).
//
// A call is open only between its open and close dates, and a player can apply
// only if they meet the rank and years-since-PhD requirements. The success
// model (`033`) and funder content (`064`) are implemented separately.

import type { Rank } from '../state/types';
import type { Grant } from './types';

const RANK_ORDER: Record<Rank, number> = {
  undergraduate: 0,
  msc: 1,
  phd: 2,
  postdoc: 3,
  assistant_professor: 4,
  tenured: 5,
};

export interface Applicant {
  rank: Rank;
  // Whole years since PhD award, or null if not yet awarded.
  years_since_phd: number | null;
}

// True when `date` (ISO) falls within the call window, inclusive. ISO dates
// compare correctly as strings.
export function isCallOpen(grant: Grant, date: string): boolean {
  return date >= grant.call_opens && date <= grant.call_closes;
}

export function meetsEligibility(grant: Grant, applicant: Applicant): boolean {
  const { rank, years_since_phd_min: min, years_since_phd_max: max } = grant.requires;
  if (RANK_ORDER[applicant.rank] < RANK_ORDER[rank]) return false;
  if (min !== null) {
    if (applicant.years_since_phd === null || applicant.years_since_phd < min) return false;
  }
  if (max !== null) {
    if (applicant.years_since_phd === null || applicant.years_since_phd > max) return false;
  }
  return true;
}

// A player can apply only to an open call they are eligible for.
export function canApply(grant: Grant, date: string, applicant: Applicant): boolean {
  return isCallOpen(grant, date) && meetsEligibility(grant, applicant);
}

// Grants whose calls are open on `date` and the applicant is eligible for.
export function openCalls(grants: Grant[], date: string, applicant: Applicant): Grant[] {
  return grants.filter((grant) => canApply(grant, date, applicant));
}
