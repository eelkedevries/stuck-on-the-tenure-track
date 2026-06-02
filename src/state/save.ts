// Save-schema types (specification §8).
//
// These mirror the save schema exactly. Collections whose element schemas are
// defined by later system prompts (health conditions, papers, grants,
// relationships, rivals, events) are typed as JSON-serialisable placeholders
// here and tightened by those prompts. Serialisation (`019`) and local-storage
// persistence (`020`) are implemented separately.

import type { JsonValue } from '../content/types';
import type { PlayerState } from './types';

export interface Calendar {
  current_date: string; // ISO date
  turn_number: number;
  start_date: string; // ISO date
}

export interface Settings {
  spelling: string;
  light_narrative_mode: boolean;
}

// Board-interaction state (specification §4.11): the player's current board
// location and the time points remaining within the current turn.
export interface BoardState {
  current_location: string;
  time_remaining: number;
}

// One recorded visit, for location memory and the ghost penalty (§4.11).
export interface LocationVisit {
  location: string;
  turn: number;
}

// The persisted player: the in-game player state (§4.1, §4.6, §4.7) plus the
// collections recorded across a career (specification §8).
export interface SavePlayer extends PlayerState {
  health_conditions: JsonValue[];
  papers: JsonValue[];
  grants_held: JsonValue[];
  grants_applied: JsonValue[];
  relationships: JsonValue[];
  milestones_completed: string[];
  // Board interaction (§4.11): where the player has spent time.
  location_visits: LocationVisit[];
}

export interface SaveGame {
  save_version: number;
  game_seed: string;
  created_at: string; // ISO datetime
  last_played_at: string; // ISO datetime
  calendar: Calendar;
  settings: Settings;
  player: SavePlayer;
  // Board interaction (§4.11) and deadlines (§4.11a). Deadline element schema is
  // a placeholder tightened by the deadline system (`080`).
  board: BoardState;
  deadlines: JsonValue[];
  rivals: JsonValue[];
  events_history: JsonValue[];
}
