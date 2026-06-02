// Location memory (specification §4.11; prompt 079).
//
// Generalises the ghost penalty (`053`) into consequences for where the player
// has spent time over a recent window: invisibility lowers standing, lab tunnel
// vision trades reputation for output, and never going home erodes sleep. All
// effects feed existing systems (standing, expertise, wellbeing) and are modest
// per turn. Returns a new SaveGame; the input is not mutated.

import type { SaveGame } from '../state/save';
import { visibilityVisits } from './ghost';
import type { LocationId } from './types';

// How many recent turns of visits to consider.
export const MEMORY_WINDOW = 3;

// Per-application effects (applied once per turn at resolution).
export const INVISIBLE_REPUTATION_PENALTY = 3;
export const INVISIBLE_PRESTIGE_PENALTY = 1;
export const LAB_FOCUS_THRESHOLD = 0.8;
export const LAB_FOCUS_METHODS_BONUS = 1;
export const LAB_FOCUS_REPUTATION_PENALTY = 2;
export const NO_HOME_SLEEP_PENALTY = 3;

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

// The locations visited within the recent window.
export function recentVisits(state: SaveGame, window: number = MEMORY_WINDOW): LocationId[] {
  const since = state.calendar.turn_number - window;
  return state.player.location_visits
    .filter((v) => v.turn > since)
    .map((v) => v.location as LocationId);
}

export function applyLocationMemory(state: SaveGame): SaveGame {
  const visits = recentVisits(state);
  if (visits.length === 0) return state;

  let reputation = state.player.standing.reputation;
  let prestige = state.player.standing.affiliation_prestige;
  let methods = state.player.expertise.methods;
  let sleep = state.player.wellbeing.sleep;

  // Invisibility: absent from every visibility-relevant location → forgotten.
  if (visibilityVisits(visits) === 0) {
    reputation -= INVISIBLE_REPUTATION_PENALTY;
    prestige -= INVISIBLE_PRESTIGE_PENALTY;
  }

  // Lab tunnel vision: great data, weaker presence.
  const labShare = visits.filter((v) => v === 'lab').length / visits.length;
  if (labShare >= LAB_FOCUS_THRESHOLD) {
    methods += LAB_FOCUS_METHODS_BONUS;
    reputation -= LAB_FOCUS_REPUTATION_PENALTY;
  }

  // Never going home: sleep erodes.
  if (!visits.includes('home')) {
    sleep -= NO_HOME_SLEEP_PENALTY;
  }

  return {
    ...state,
    player: {
      ...state.player,
      standing: {
        ...state.player.standing,
        reputation: clamp(reputation),
        affiliation_prestige: clamp(prestige),
      },
      expertise: { ...state.player.expertise, methods: clamp(methods) },
      wellbeing: { ...state.player.wellbeing, sleep: clamp(sleep) },
    },
  };
}
