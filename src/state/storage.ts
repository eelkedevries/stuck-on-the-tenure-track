// Single-slot local-browser-storage persistence (specification §5, §8).
//
// One save slot is held under a fixed key. Storage is injectable so the
// functions can run in non-browser contexts (and be tested); in the browser
// they default to `localStorage`. Multiple slots, cloud sync, and accounts are
// out of scope (specification §9).

import type { SaveGame } from './save';
import { deserialise, serialise } from './serialise';

export const SAVE_KEY = 'stuck-on-the-tenure-track/save';

function defaultStorage(): Storage | null {
  return typeof localStorage !== 'undefined' ? localStorage : null;
}

// Persist the game state to the single save slot. Called at turn end.
export function saveGame(state: SaveGame, storage: Storage | null = defaultStorage()): void {
  storage?.setItem(SAVE_KEY, serialise(state));
}

// Load the saved game, or null if no save exists. Called on start.
export function loadGame(storage: Storage | null = defaultStorage()): SaveGame | null {
  const raw = storage?.getItem(SAVE_KEY) ?? null;
  return raw === null ? null : deserialise(raw);
}

// Clear the save slot (reset / new game).
export function clearSave(storage: Storage | null = defaultStorage()): void {
  storage?.removeItem(SAVE_KEY);
}

export function hasSave(storage: Storage | null = defaultStorage()): boolean {
  return (storage?.getItem(SAVE_KEY) ?? null) !== null;
}
