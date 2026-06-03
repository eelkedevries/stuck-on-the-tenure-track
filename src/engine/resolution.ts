// Resolution phase (specification §4.2).
//
// Applies the committed action allocation to the game state, then checks
// milestone and game-end triggers. Effects here are deliberately light and
// generic: the deep per-system logic (papers, grants, health, …) is added by
// those systems' own prompts. Milestone and tenure logic are stubbed for `048`
// and `049`; this phase only provides the hooks and runs them.

import type { SaveGame } from '../state/save';
import type { Allocation } from './actions';
import { applyOutcomes } from './outcomes';
import { applyLocationMemory } from '../locations/memory';
import { advanceDeadlines } from '../deadlines/deadlines';

// Apply the generic skill gains of the time invested this turn. Whole points
// convert to small expertise changes; the substantive system outcomes (papers,
// grants, health, relationships) are applied by `applyOutcomes`.
export function applyActions(state: SaveGame, allocation: Allocation): SaveGame {
  const expertise = { ...state.player.expertise };
  // Studying/researching builds a spread of academic skills, so the player can
  // work toward the stage sub-goals (theory, methods, statistics, writing) by
  // studying — not only through chance events.
  expertise.methods += Math.floor(allocation.research / 25);
  expertise.theory += Math.floor(allocation.research / 40);
  expertise.statistics += Math.floor(allocation.research / 45);
  expertise.writing += Math.floor(allocation.research / 50) + Math.floor(allocation.funding / 50);
  expertise.teaching += Math.floor(allocation.teaching / 25);
  expertise.politics += Math.floor((allocation.networking + allocation.service) / 50);

  return { ...state, player: { ...state.player, expertise } };
}

// Milestones reached this turn. Real milestone logic arrives in `048`.
export function checkMilestones(_state: SaveGame): string[] {
  return [];
}

// Game-end trigger. Full tenure-decision logic arrives in `049`; for now the
// game ends once the player is tenured (the win condition, specification §4.10).
export function isGameOver(state: SaveGame): boolean {
  return state.player.standing.rank === 'tenured';
}

export interface ResolutionResult {
  state: SaveGame;
  newMilestones: string[];
  gameOver: boolean;
}

export function resolve(
  state: SaveGame,
  allocation: Allocation,
  rng: () => number = Math.random,
): ResolutionResult {
  const applied = advanceDeadlines(
    applyLocationMemory(applyOutcomes(applyActions(state, allocation), allocation, rng)),
    allocation,
  );
  return {
    state: applied,
    newMilestones: checkMilestones(applied),
    gameOver: isGameOver(applied),
  };
}
