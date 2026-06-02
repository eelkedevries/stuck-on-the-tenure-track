// Citation dynamics (specification §4.3).
//
// Citations accrue in a long-tailed pattern concentrated in years 2–5 after
// publication, and top-tier papers (lower tier number) receive substantially
// more. Accrual is deterministic here so it is testable; per-paper variation
// across a career produces the long tail. Retraction stops accrual; the h-index
// (`030`) is computed elsewhere.

import type { Paper } from './types';

// Relative weight of citations gained in each year after publication. The curve
// is low in year 1, peaks across years 2–5, then decays into a long tail.
const YEAR_WEIGHTS = [0, 0.5, 1, 1, 0.8, 0.6];
const TAIL_DECAY = 0.7;

export const CITATION_SCALE = 4;

function yearWeight(yearSincePublication: number): number {
  if (yearSincePublication <= 0) return 0;
  if (yearSincePublication < YEAR_WEIGHTS.length) {
    return YEAR_WEIGHTS[yearSincePublication];
  }
  return YEAR_WEIGHTS[YEAR_WEIGHTS.length - 1] * TAIL_DECAY ** (yearSincePublication - 5);
}

// Lower tier number = more prestigious = more citations. Tier 1 → 5, tier 5 → 1.
function tierWeight(tier: number): number {
  return Math.max(1, 6 - tier);
}

export function expectedAnnualCitations(tier: number, yearSincePublication: number): number {
  return tierWeight(tier) * yearWeight(yearSincePublication) * CITATION_SCALE;
}

export function expectedCumulativeCitations(tier: number, years: number): number {
  let total = 0;
  for (let t = 1; t <= years; t += 1) {
    total += expectedAnnualCitations(tier, t);
  }
  return Math.round(total);
}

function toMillis(iso: string): number {
  return new Date(`${iso}T00:00:00Z`).getTime();
}

function fullYearsBetween(from: string, to: string): number {
  const ms = toMillis(to) - toMillis(from);
  if (ms <= 0) return 0;
  return Math.floor(ms / (365.25 * 24 * 60 * 60 * 1000));
}

function earlier(a: string, b: string): string {
  return a <= b ? a : b;
}

// Accrue citations up to `asOfDate`, recording a snapshot in citations_history.
// Returns a new paper; the input is not mutated. Unpublished papers accrue
// nothing; retracted papers accrue only up to their retraction date.
export function accrueCitations(paper: Paper, asOfDate: string): Paper {
  if (paper.status !== 'published' && paper.status !== 'retracted') return paper;
  if (paper.date_published === null) return paper;

  const end =
    paper.status === 'retracted' && paper.date_retracted !== null
      ? earlier(asOfDate, paper.date_retracted)
      : asOfDate;

  const years = fullYearsBetween(paper.date_published, end);
  const count = expectedCumulativeCitations(paper.journal.tier, years);

  return {
    ...paper,
    citations: count,
    citations_history: [...paper.citations_history, { date: asOfDate, count }],
  };
}
