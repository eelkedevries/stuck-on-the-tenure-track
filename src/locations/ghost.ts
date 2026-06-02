// Ghost penalty (specification §4.11).
//
// A player who never appears in visibility-relevant social locations becomes a
// "ghost" and pays a standing penalty: colleagues forget they exist. Reputation
// display is UI (M13); endings are `049`. Functions return new values; inputs
// are not mutated.

import type { SaveGame } from '../state/save';
import { LOCATIONS, type LocationId } from './types';

export const GHOST_REPUTATION_PENALTY = 8;
export const GHOST_PRESTIGE_PENALTY = 4;

// Count visits to visibility-relevant locations in a list of visited locations.
export function visibilityVisits(visited: LocationId[]): number {
  return visited.filter((id) => LOCATIONS[id].visibilityRelevant).length;
}

// A player is a ghost when they have not appeared in any visibility-relevant
// location over the window in question.
export function isGhost(visibilityVisitCount: number): boolean {
  return visibilityVisitCount === 0;
}

// Apply the ghost penalty to standing when the player has been absent from all
// visibility-relevant locations. No penalty if they appeared at least once.
export function applyGhostPenalty(state: SaveGame, visibilityVisitCount: number): SaveGame {
  if (!isGhost(visibilityVisitCount)) return state;
  return {
    ...state,
    player: {
      ...state.player,
      standing: {
        ...state.player.standing,
        reputation: Math.max(0, state.player.standing.reputation - GHOST_REPUTATION_PENALTY),
        affiliation_prestige: Math.max(
          0,
          state.player.standing.affiliation_prestige - GHOST_PRESTIGE_PENALTY,
        ),
      },
    },
  };
}
