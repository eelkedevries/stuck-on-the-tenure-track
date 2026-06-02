// Specialisation progression (specification §4.6).
//
// undeclared → leaning (MSc choice) → committed (PhD supervisor selection) →
// switched (later, at significant cost). Sub-discipline content (M15) and
// supervisor archetypes (`036`) are handled elsewhere. Functions return new
// values; inputs are not mutated.

import type { Specialisation } from '../state/types';
import type { SaveGame } from '../state/save';

// The cost of switching specialisation after committing.
export const SWITCH_REPUTATION_COST = 5;
export const SWITCH_EXPERTISE_COST = 5;

// Lean towards a sub-discipline (typically during the MSc).
export function lean(specialisation: Specialisation, subDiscipline: string): Specialisation {
  return { ...specialisation, status: 'leaning', current_sub_discipline: subDiscipline };
}

// Commit to a sub-discipline (typically at PhD supervisor selection).
export function commit(
  specialisation: Specialisation,
  subDiscipline: string,
  turn: number,
): Specialisation {
  return { status: 'committed', current_sub_discipline: subDiscipline, commitment_turn: turn };
}

// Switch sub-discipline after committing, applying a significant cost to the
// player's reputation and theory expertise. Throws if not yet committed.
export function switchSpecialisation(
  state: SaveGame,
  newSubDiscipline: string,
  turn: number,
): SaveGame {
  if (state.player.specialisation.status !== 'committed') {
    throw new Error('Specialisation can only be switched after committing.');
  }
  const specialisation: Specialisation = {
    status: 'switched',
    current_sub_discipline: newSubDiscipline,
    commitment_turn: turn,
  };
  const standing = {
    ...state.player.standing,
    reputation: Math.max(0, state.player.standing.reputation - SWITCH_REPUTATION_COST),
  };
  const expertise = {
    ...state.player.expertise,
    theory: Math.max(0, state.player.expertise.theory - SWITCH_EXPERTISE_COST),
  };
  return { ...state, player: { ...state.player, specialisation, standing, expertise } };
}
