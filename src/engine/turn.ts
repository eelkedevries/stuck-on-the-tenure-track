// Turn-loop skeleton (specification §4.2).
//
// The canonical turn runs seven phases in order. Each phase is a stub here:
// the event, action, resolution, and rival phases are filled in by later
// prompts (`024`, `025`, `046`). This prompt wires the loop together so that
// running a turn advances the calendar (turn start) and persists the game
// (save phase), with the phases called in the specified order.

import type { SaveGame } from '../state/save';
import type { Stage } from '../calendar/stages';
import { advanceTurn } from '../calendar/stages';
import { saveGame } from '../state/storage';
import { emptyAllocation, type Allocation } from './actions';
import { resolve, type ResolutionResult } from './resolution';
import { simulateRivals, type Rival } from '../rivals/simulation';

export type TurnPhase =
  | 'turn_start'
  | 'event'
  | 'action'
  | 'resolution'
  | 'rival'
  | 'save'
  | 'turn_end';

export const TURN_PHASES: readonly TurnPhase[] = [
  'turn_start',
  'event',
  'action',
  'resolution',
  'rival',
  'save',
  'turn_end',
];

export interface RunTurnDeps {
  // The player's committed action allocation for this turn (defaults to none).
  allocation?: Allocation;
  // Storage for the save phase; defaults to browser localStorage inside saveGame.
  storage?: Storage | null;
  // Optional observer, called as each phase begins. Useful for UI and tests.
  onPhase?: (phase: TurnPhase) => void;
  // Optional observer for the resolution result (effects + checks).
  onResolution?: (result: ResolutionResult) => void;
  // The cohort's rivals, advanced in parallel during the rival phase.
  rivals?: Rival[];
  // Optional observer for the advanced rivals.
  onRivals?: (rivals: Rival[]) => void;
  // Randomness for the rival simulation; injectable for determinism.
  rng?: () => number;
}

// Stub phases. Later prompts replace these with real behaviour; for now they
// return the state unchanged so the loop is observable end to end.
function eventPhase(state: SaveGame): SaveGame {
  return state;
}

// Run one full turn for the given career stage. Returns the new state; the
// input is not mutated.
export function runTurn(state: SaveGame, stage: Stage, deps: RunTurnDeps = {}): SaveGame {
  let next = state;
  for (const phase of TURN_PHASES) {
    deps.onPhase?.(phase);
    switch (phase) {
      case 'turn_start':
        next = { ...next, calendar: advanceTurn(next.calendar, stage) };
        break;
      case 'event':
        next = eventPhase(next);
        break;
      case 'action':
        // The action phase carries the player's committed allocation forward;
        // its effects are applied in the resolution phase.
        break;
      case 'resolution': {
        const result = resolve(next, deps.allocation ?? emptyAllocation(), deps.rng);
        next = result.state;
        deps.onResolution?.(result);
        break;
      }
      case 'rival':
        if (deps.rivals) {
          deps.onRivals?.(simulateRivals(deps.rivals, deps.rng));
        }
        break;
      case 'save':
        next = { ...next, last_played_at: new Date().toISOString() };
        saveGame(next, deps.storage);
        break;
      case 'turn_end':
        break;
    }
  }
  return next;
}
