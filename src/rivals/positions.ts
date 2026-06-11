// Rival board positions (specification §4.9, §4.11).
//
// Rivals live on the same campus, so they should be visible on the board —
// queueing at the library, holding court in the café — like the other players
// in a hot-seat board game. Positions are cosmetic and deterministic (hash of
// rival id and turn), so they are stable within a turn, change between turns,
// and need no persistence. The simulation itself is untouched.

import type { Rank } from '../state/types';
import type { LocationId } from '../locations/types';

// Where each kind of academic plausibly hangs about. Parks and the health
// centre stay private — you never catch a rival resting.
const STUDENT_SPOTS: LocationId[] = [
  'classroom',
  'library',
  'cafe_pub',
  'seminar_room',
  'home',
  'gym_outdoors',
];

const RESEARCHER_SPOTS: LocationId[] = [
  'lab',
  'office',
  'library',
  'conference_venue',
  'funder_portal',
  'cafe_pub',
  'seminar_room',
];

function hash(text: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function rivalPosition(rivalId: string, rank: Rank, turn: number): LocationId {
  const spots =
    rank === 'undergraduate' || rank === 'msc' ? STUDENT_SPOTS : RESEARCHER_SPOTS;
  return spots[hash(`${rivalId}:${turn}`) % spots.length];
}
