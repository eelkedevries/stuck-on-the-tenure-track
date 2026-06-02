// Resolution phase (specification §4.2).
//
// Applies the committed action allocation to the game state, then checks
// milestone and game-end triggers. Effects here are deliberately light and
// generic: the deep per-system logic (papers, grants, health, …) is added by
// those systems' own prompts. Milestone and tenure logic are stubbed for `048`
// and `049`; this phase only provides the hooks and runs them.

import type { SaveGame } from '../state/save';
import type { Allocation } from './actions';

// Apply generic, proportional effects of the time invested this turn. Whole
// points convert to small skill and wellbeing changes; detailed outcomes are
// layered on by later prompts.
export function applyActions(state: SaveGame, allocation: Allocation): SaveGame {
  const expertise = { ...state.player.expertise };
  expertise.methods += Math.floor(allocation.research / 25);
  expertise.teaching += Math.floor(allocation.teaching / 25);
  expertise.politics += Math.floor((allocation.networking + allocation.service) / 50);
  expertise.writing += Math.floor(allocation.funding / 50);

  const wellbeing = { ...state.player.wellbeing };
  wellbeing.mood += Math.floor(allocation.personal / 25);

  return { ...state, player: { ...state.player, expertise, wellbeing } };
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

export function resolve(state: SaveGame, allocation: Allocation): ResolutionResult {
  const applied = applyActions(state, allocation);
  return {
    state: applied,
    newMilestones: checkMilestones(applied),
    gameOver: isGameOver(applied),
  };
}
