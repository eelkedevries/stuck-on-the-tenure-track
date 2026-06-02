// Single-slot local-browser-storage persistence (specification §5, §8).
//
// One save slot is held under a fixed key. Storage is injectable so the
// functions can run in non-browser contexts (and be tested); in the browser
// they default to `localStorage`. Multiple slots, cloud sync, and accounts are
// out of scope (specification §9).

import type { SaveGame } from './save';
import { deserialise, serialise, SAVE_VERSION } from './serialise';

export const SAVE_KEY = 'stuck-on-the-tenure-track/save';

function defaultStorage(): Storage | null {
  return typeof localStorage !== 'undefined' ? localStorage : null;
}

// Persist the game state to the single save slot. Called at turn end.
export function saveGame(state: SaveGame, storage: Storage | null = defaultStorage()): void {
  storage?.setItem(SAVE_KEY, serialise(state));
}

// Load the saved game, or null if no save exists. A save from an incompatible
// version is reset and treated as absent (single-slot beta: no migration).
export function loadGame(storage: Storage | null = defaultStorage()): SaveGame | null {
  const raw = storage?.getItem(SAVE_KEY) ?? null;
  if (raw === null) return null;
  const parsed = deserialise(raw);
  if (parsed.save_version !== SAVE_VERSION) {
    storage?.removeItem(SAVE_KEY);
    return null;
  }
  return parsed;
}

// Clear the save slot (reset / new game).
export function clearSave(storage: Storage | null = defaultStorage()): void {
  storage?.removeItem(SAVE_KEY);
}

// Whether a loadable, version-compatible save exists. Non-destructive.
export function hasSave(storage: Storage | null = defaultStorage()): boolean {
  const raw = storage?.getItem(SAVE_KEY) ?? null;
  if (raw === null) return false;
  try {
    return (JSON.parse(raw) as { save_version?: number }).save_version === SAVE_VERSION;
  } catch {
    return false;
  }
}
