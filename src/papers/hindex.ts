// h-index computation (specification §4.1, §4.3).
//
// The h-index is computed on demand from papers' citations, never stored. A
// researcher has h-index h when h of their papers have at least h citations
// each.

import type { Paper } from './types';

export function hIndexFromCitations(citationCounts: number[]): number {
  const sorted = [...citationCounts].sort((a, b) => b - a);
  let h = 0;
  for (let i = 0; i < sorted.length; i += 1) {
    if (sorted[i] >= i + 1) h = i + 1;
    else break;
  }
  return h;
}

export function hIndex(papers: Paper[]): number {
  return hIndexFromCitations(papers.map((p) => p.citations));
}
