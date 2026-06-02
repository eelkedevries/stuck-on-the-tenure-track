// Lossless serialisation of the game state (specification §8, §1.3).
//
// The save schema is composed entirely of JSON-serialisable values, so a
// JSON round-trip is lossless. Migrations beyond recording the save version are
// out of scope here.

import type { SaveGame } from './save';

// Current save format version. Persisted in `SaveGame.save_version`. Bumped to 3
// for the emotional-state (stress) wellbeing field (§4.1); incompatible older
// saves are reset on load (single-slot beta).
export const SAVE_VERSION = 3;

export function serialise(state: SaveGame): string {
  return JSON.stringify(state);
}

export function deserialise(json: string): SaveGame {
  return JSON.parse(json) as SaveGame;
}
