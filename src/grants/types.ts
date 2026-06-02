// Grant object types (specification §4.4).
//
// Grants are first-class objects with calendar-bound calls and eligibility
// requirements. Call scheduling (`032`), the success model (`033`), and funder
// content (`064`) are implemented by their own prompts. All fields are
// JSON-serialisable.

import type { Rank } from '../state/types';

export interface GrantEligibility {
  rank: Rank;
  years_since_phd_min: number | null;
  years_since_phd_max: number | null;
}

export interface Grant {
  grant_id: string;
  funder: string;
  scheme: string;
  amount: number;
  duration_turns: number;
  call_opens: string; // ISO date
  call_closes: string; // ISO date
  typical_success_rate: number; // 0..1
  requires: GrantEligibility;
}
