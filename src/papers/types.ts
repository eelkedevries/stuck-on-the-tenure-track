// Paper object types (specification §4.3).
//
// Papers are first-class objects. All fields are JSON-serialisable. Lifecycle
// transitions (`027`), authorship weighting (`028`), citation dynamics (`029`),
// and h-index computation (`030`) are implemented by their own prompts.

export type PaperStatus =
  | 'in_preparation'
  | 'submitted'
  | 'under_revision'
  | 'rejected'
  | 'published'
  | 'retracted';

// Per-paper misconduct classification (specification §4.8).
export type MisconductLevel = 'none' | 'grey' | 'outright';

export interface PaperAuthor {
  author_id: string;
  position: number;
  is_corresponding: boolean;
}

export interface Journal {
  name: string;
  tier: number;
  impact_factor: number;
}

export interface CitationSnapshot {
  date: string; // ISO date
  count: number;
}

export interface Paper {
  paper_id: string;
  title: string;
  authors: PaperAuthor[];
  journal: Journal;
  status: PaperStatus;
  date_started: string; // ISO date
  date_submitted: string | null;
  date_published: string | null;
  date_retracted: string | null;
  citations: number;
  citations_history: CitationSnapshot[];
  methodology_quality: number;
  contains_misconduct: MisconductLevel;
  contains_misconduct_by: string | null;
  preregistered: boolean;
  open_data: boolean;
  visibility: number;
}
