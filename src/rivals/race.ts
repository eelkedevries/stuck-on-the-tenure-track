// Cohort race standings (specification §4.9, §4.10).
//
// The win condition is being first to tenure, so the cohort is a race and the
// player should always know where they stand in it. This module folds the
// player and the rivals into one ordered table using only public outputs —
// publications, h-index, and institutional prestige — the same view the
// cohort tracker exposes. Purely derived; nothing here is persisted.

import type { SaveGame } from '../state/save';
import type { Paper } from '../papers/types';
import { hIndex } from '../papers/hindex';
import type { Rival } from './simulation';

export interface RaceEntry {
  id: string;
  name: string;
  isPlayer: boolean;
  publications: number;
  h_index: number;
  prestige: number;
  score: number;
  // 1-based position after sorting; ties share the better position.
  position: number;
}

// One comparable academic score from public outputs. Early on everyone sits
// roughly level; once publishing starts, output and impact decide. The player's
// personal reputation counts too — rivals fold theirs into prestige via the
// simulation's networking gains — so attending commitments and handling events
// well visibly moves the player up the table before the first paper exists.
function publicScore(publications: number, h: number, prestige: number, reputation = 0): number {
  return Math.round(publications * 3 + h * 4 + prestige / 5 + reputation / 3);
}

const ORDINALS = ['1st', '2nd', '3rd', '4th', '5th', '6th'];

export function ordinal(position: number): string {
  return ORDINALS[position - 1] ?? `${position}th`;
}

export function raceStandings(state: SaveGame, rivals: Rival[]): RaceEntry[] {
  const papers = state.player.papers as unknown as Paper[];
  const published = papers.filter((p) => p.status === 'published').length;
  const player: Omit<RaceEntry, 'position'> = {
    id: 'player',
    name: 'You',
    isPlayer: true,
    publications: published,
    h_index: hIndex(papers),
    prestige: state.player.standing.affiliation_prestige,
    score: publicScore(
      published,
      hIndex(papers),
      state.player.standing.affiliation_prestige,
      state.player.standing.reputation,
    ),
  };
  const others: Omit<RaceEntry, 'position'>[] = rivals.map((r) => ({
    id: r.rival_id,
    name: r.name,
    isPlayer: false,
    publications: r.publications,
    h_index: r.h_index,
    prestige: r.affiliation_prestige,
    score: publicScore(r.publications, r.h_index, r.affiliation_prestige),
  }));

  const sorted = [player, ...others].sort((a, b) => b.score - a.score);
  // Tied scores share the better position, so a level cohort reads as joint.
  const entries: RaceEntry[] = [];
  for (let i = 0; i < sorted.length; i += 1) {
    const position =
      i > 0 && sorted[i - 1].score === sorted[i].score ? entries[i - 1].position : i + 1;
    entries.push({ ...sorted[i], position });
  }
  return entries;
}

// One short line for the board: where the player stands right now.
export function raceLine(standings: RaceEntry[]): string {
  const you = standings.find((e) => e.isPlayer);
  if (!you) return '';
  const field = standings.length;
  const leaders = standings.filter((e) => e.position === 1);
  if (you.position === 1) {
    return leaders.length > 1
      ? `Joint ${ordinal(1)} of ${field} in the cohort race.`
      : `You lead the cohort race.`;
  }
  const leader = standings[0];
  const gap = leader.score - you.score;
  return `${leader.name} leads — you are ${ordinal(you.position)} of ${field}, ${gap} point${gap === 1 ? '' : 's'} behind.`;
}
