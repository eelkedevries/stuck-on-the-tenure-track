// Board geometry (specification §4.11; prompt 090).
//
// The campus is a square grid. Each location sits at a fixed cell, and travel
// between locations costs time in proportion to their grid (Manhattan) distance,
// so a short hop is cheap and a cross-board trip is dear. Shared by the board
// component (for layout and per-tile cost) and the store (for moveTo cost), so
// there is a single source of truth.

import type { LocationId } from './types';

export const BOARD_SIZE = 5; // 5 x 5 grid
export const PER_STEP = 3; // time points per grid step

// Cell coordinates (0-indexed) for each location on the square board.
export const COORDS: Record<LocationId, { x: number; y: number }> = {
  home: { x: 0, y: 0 },
  cafe_pub: { x: 2, y: 0 },
  conference_venue: { x: 4, y: 0 },
  library: { x: 0, y: 2 },
  seminar_room: { x: 2, y: 2 },
  health_centre: { x: 4, y: 2 },
  classroom: { x: 0, y: 4 },
  lab: { x: 2, y: 4 },
  funder_portal: { x: 4, y: 4 },
  office: { x: 1, y: 1 },
  gym_outdoors: { x: 3, y: 3 },
};

export function travelCost(from: LocationId, to: LocationId): number {
  if (from === to) return 0;
  const a = COORDS[from];
  const b = COORDS[to];
  return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y)) * PER_STEP;
}
