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

// Ring-layout coordinates (0-indexed) on the 5×5 perimeter grid.
// Locations occupy the outer ring; the inner 3×3 is the centre activity window.
// Travel cost keeps the original rule: Manhattan distance × PER_STEP.
export const COORDS: Record<LocationId, { x: number; y: number }> = {
  upscale_home:     { x: 0, y: 0 },
  library:          { x: 1, y: 0 },
  home:             { x: 2, y: 0 },
  office:           { x: 3, y: 0 },
  lab:              { x: 4, y: 0 },
  classroom:        { x: 4, y: 1 },
  park_east:        { x: 4, y: 2 },
  seminar_room:     { x: 4, y: 3 },
  conference_venue: { x: 4, y: 4 },
  funder_portal:    { x: 3, y: 4 },
  cafe_pub:         { x: 1, y: 4 },
  gym_outdoors:     { x: 0, y: 4 },
  health_centre:    { x: 0, y: 3 },
  park_west:        { x: 0, y: 2 },
};

export function travelCost(from: LocationId, to: LocationId): number {
  if (from === to) return 0;
  const a = COORDS[from];
  const b = COORDS[to];
  return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y)) * PER_STEP;
}
