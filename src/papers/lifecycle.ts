// Paper lifecycle transitions (specification §4.3).
//
// in preparation → submitted → (revision ⇄ submitted | rejected) → published
// → retracted. Each transition stamps the relevant date and rejects illegal
// moves. Citation accrual (`029`) and misconduct detection (`044`) are handled
// elsewhere. All functions return a new paper; inputs are not mutated.

import type { Paper, PaperStatus } from './types';

const ALLOWED: Record<PaperStatus, readonly PaperStatus[]> = {
  in_preparation: ['submitted'],
  submitted: ['under_revision', 'rejected', 'published'],
  under_revision: ['submitted', 'rejected', 'published'],
  rejected: ['submitted'],
  published: ['retracted'],
  retracted: [],
};

export function canTransition(from: PaperStatus, to: PaperStatus): boolean {
  return ALLOWED[from].includes(to);
}

function transition(paper: Paper, to: PaperStatus, patch: Partial<Paper> = {}): Paper {
  if (!canTransition(paper.status, to)) {
    throw new Error(`Illegal paper transition: ${paper.status} → ${to}.`);
  }
  return { ...paper, ...patch, status: to };
}

export function submit(paper: Paper, date: string): Paper {
  return transition(paper, 'submitted', { date_submitted: date });
}

export function requestRevision(paper: Paper): Paper {
  return transition(paper, 'under_revision');
}

// Resubmit a revised paper back to the journal.
export function resubmit(paper: Paper, date: string): Paper {
  return transition(paper, 'submitted', { date_submitted: date });
}

export function reject(paper: Paper): Paper {
  return transition(paper, 'rejected');
}

export function publish(paper: Paper, date: string): Paper {
  return transition(paper, 'published', { date_published: date });
}

export function retract(paper: Paper, date: string): Paper {
  return transition(paper, 'retracted', { date_retracted: date });
}
