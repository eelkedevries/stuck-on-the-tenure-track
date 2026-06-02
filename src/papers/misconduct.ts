// Per-paper misconduct (specification §4.8).
//
// Misconduct is tracked on the paper, attributed to an author — never as a
// global player flag. Grey-area practices and outright misconduct map to the
// paper's `contains_misconduct` level; outright dominates grey. Detection
// (`044`) is handled separately. Functions return a new paper; inputs are not
// mutated.

import type { MisconductLevel, Paper } from './types';

export type GreyPractice =
  | 'harking'
  | 'selective_reporting'
  | 'p_hacking'
  | 'gift_authorship'
  | 'salami_slicing'
  | 'citation_gaming';

export type OutrightPractice = 'fabrication' | 'falsification' | 'plagiarism';

export type MisconductPractice = GreyPractice | OutrightPractice;

export const GREY_PRACTICES: readonly GreyPractice[] = [
  'harking',
  'selective_reporting',
  'p_hacking',
  'gift_authorship',
  'salami_slicing',
  'citation_gaming',
];

export const OUTRIGHT_PRACTICES: readonly OutrightPractice[] = [
  'fabrication',
  'falsification',
  'plagiarism',
];

export function practiceLevel(practice: MisconductPractice): MisconductLevel {
  return (OUTRIGHT_PRACTICES as readonly string[]).includes(practice) ? 'outright' : 'grey';
}

// Record a misconduct practice on a paper, attributed to an author. Outright
// misconduct dominates a prior grey classification.
export function recordMisconduct(
  paper: Paper,
  practice: MisconductPractice,
  authorId: string,
): Paper {
  const level = practiceLevel(practice);
  const escalated: MisconductLevel = paper.contains_misconduct === 'outright' ? 'outright' : level;
  return { ...paper, contains_misconduct: escalated, contains_misconduct_by: authorId };
}

export function hasMisconduct(paper: Paper): boolean {
  return paper.contains_misconduct !== 'none';
}

export function hasOutrightMisconduct(paper: Paper): boolean {
  return paper.contains_misconduct === 'outright';
}
