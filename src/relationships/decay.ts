// Relationship decay (specification §4.5).
//
// Neglected relationships lose score each turn at role-specific rates and can
// end. Interacting restores score and resets the idle clock. Supervisor
// archetypes (`036`) and the CV costs list (`061`) are handled elsewhere. All
// functions return a new NPC; inputs are not mutated.

import type { Npc, NpcRole, RelationshipStatus } from './types';

// Score lost per turn of neglect, by role. Partners and collaborators decay
// fastest; family is the most forgiving.
const DECAY_PER_TURN: Record<NpcRole, number> = {
  partner: 6,
  family: 2,
  friend: 4,
  collaborator: 5,
  supervisor: 3,
  phd_student: 4,
  postdoc: 4,
  colleague: 3,
};

export const MAX_SCORE = 100;
export const DEFAULT_INTERACTION_GAIN = 12;

export function statusForScore(score: number): RelationshipStatus {
  if (score <= 0) return 'ended';
  if (score < 25) return 'distant';
  if (score < 50) return 'strained';
  return 'active';
}

// Apply one turn of decay if the NPC was not interacted with this turn. Ended
// relationships stay ended.
export function decayStep(npc: Npc, currentTurn: number): Npc {
  if (npc.relationship_status === 'ended') return npc;
  if (npc.last_interaction_turn >= currentTurn) return npc;
  const score = Math.max(0, npc.relationship_score - DECAY_PER_TURN[npc.role_relative_to_player]);
  return { ...npc, relationship_score: score, relationship_status: statusForScore(score) };
}

// Interact with an NPC, raising the score and resetting the idle clock.
export function interact(
  npc: Npc,
  currentTurn: number,
  gain: number = DEFAULT_INTERACTION_GAIN,
): Npc {
  if (npc.relationship_status === 'ended') return npc;
  const score = Math.min(MAX_SCORE, npc.relationship_score + gain);
  return {
    ...npc,
    relationship_score: score,
    relationship_status: statusForScore(score),
    last_interaction_turn: currentTurn,
  };
}
