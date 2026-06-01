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

// The persisted player: the in-game player state (§4.1, §4.6, §4.7) plus the
// collections recorded across a career (specification §8).
export interface SavePlayer extends PlayerState {
  health_conditions: JsonValue[];
  papers: JsonValue[];
  grants_held: JsonValue[];
  grants_applied: JsonValue[];
  relationships: JsonValue[];
  milestones_completed: string[];
}

export interface SaveGame {
  save_version: number;
  game_seed: string;
  created_at: string; // ISO datetime
  last_played_at: string; // ISO datetime
  calendar: Calendar;
  settings: Settings;
  player: SavePlayer;
  rivals: JsonValue[];
  events_history: JsonValue[];
}
