// Build CV-screen data from final game state (specification §4.12).
//
// Maps the recorded SaveGame into the CvScreen's typed CvData. Fields with a
// real recorded source (publications, citations, grants, ended relationships,
// chronic conditions, sleep deficit) are derived; fields with no source in the
// current schema (awards, teaching, service, hobbies, sick leave, cities) are
// left empty/zero rather than fabricated.

import type { SaveGame } from '../state/save';
import type { CvData } from './CvScreen.svelte';
import type { Paper } from '../papers/types';
import { hIndex } from '../papers/hindex';

interface HeldGrant {
  scheme?: string;
  funder?: string;
  amount?: number;
}

interface Relationship {
  status?: string;
}

interface HealthCondition {
  name?: string;
  chronic?: boolean;
}

export function buildCv(state: SaveGame): CvData {
  const papers = (state.player.papers ?? []) as unknown as Paper[];
  const grants = (state.player.grants_held ?? []) as unknown as HeldGrant[];
  const relationships = (state.player.relationships ?? []) as unknown as Relationship[];
  const conditions = (state.player.health_conditions ?? []) as unknown as HealthCondition[];

  const tenured = state.player.standing.rank === 'tenured';
  const totalCitations = papers.reduce((sum, p) => sum + (p.citations ?? 0), 0);

  return {
    name: state.player.name,
    finalPlacement: tenured
      ? 'Awarded tenure — a job for life, and the committees to match.'
      : 'Career concluded without a tenured offer.',
    publications: papers
      .filter((p) => p.status === 'published')
      .map((p) => ({
        title: p.title,
        venue: p.journal?.name ?? 'Unknown venue',
        year: p.date_published ? new Date(p.date_published).getUTCFullYear() : null,
        citations: p.citations ?? 0,
      })),
    totalCitations,
    hIndex: hIndex(papers),
    grants: grants.map((g) => ({
      scheme: g.scheme ?? 'Grant',
      funder: g.funder ?? 'Unknown funder',
      amount: g.amount ?? 0,
    })),
    awards: [],
    teaching: [],
    service: [],
    costs: {
      relationshipsEnded: relationships.filter((r) => r.status === 'ended').length,
      hobbiesAbandoned: 0,
      sickLeaveTurns: 0,
      chronicConditions: conditions
        .filter((c) => c.chronic)
        .map((c) => c.name ?? 'Chronic condition'),
      shortTermCities: 0,
      sleepDeficit: Math.max(0, 100 - state.player.wellbeing.sleep),
    },
  };
}
