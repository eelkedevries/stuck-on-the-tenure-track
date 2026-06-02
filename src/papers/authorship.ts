// Authorship weighting (specification §4.3).
//
// Psychology convention: the first author matters most, the last author carries
// senior-author weight, and middle authors carry reduced weight. This module
// computes relative author credit. Citation accrual (`029`) and the h-index
// (`030`) are computed elsewhere.

import type { Paper, PaperAuthor } from './types';

export const FIRST_AUTHOR_CREDIT = 1;
export const LAST_AUTHOR_CREDIT = 0.75;
export const MIDDLE_AUTHOR_CREDIT = 0.25;
export const SOLE_AUTHOR_CREDIT = 1;

// Credit for an author given the full author list. Returns 0 if the author is
// not on the paper.
export function authorCredit(authors: PaperAuthor[], authorId: string): number {
  const author = authors.find((a) => a.author_id === authorId);
  if (!author) return 0;
  if (authors.length === 1) return SOLE_AUTHOR_CREDIT;

  const positions = authors.map((a) => a.position);
  const firstPosition = Math.min(...positions);
  const lastPosition = Math.max(...positions);

  if (author.position === firstPosition) return FIRST_AUTHOR_CREDIT;
  if (author.position === lastPosition) return LAST_AUTHOR_CREDIT;
  return MIDDLE_AUTHOR_CREDIT;
}

export function paperAuthorCredit(paper: Paper, authorId: string): number {
  return authorCredit(paper.authors, authorId);
}

// All authors with their credit, ordered by credit descending then position.
export function authorCredits(
  authors: PaperAuthor[],
): { author_id: string; credit: number }[] {
  return authors
    .map((a) => ({ author_id: a.author_id, credit: authorCredit(authors, a.author_id) }))
    .sort((x, y) => y.credit - x.credit);
}
