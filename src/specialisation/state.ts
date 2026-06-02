// Specialisation state (specification §4.6).
//
// The player begins undeclared and specialises progressively. This module owns
// the default state and status predicates; the progression transitions
// (lean → commit → switch) are implemented by `038`, and sub-discipline content
// by milestone M15. The `Specialisation` shape is defined in `../state/types`.

import type { Specialisation } from '../state/types';

// A fresh specialisation: undeclared, with no sub-discipline or commitment yet.
export function createSpecialisation(): Specialisation {
  return { status: 'undeclared', current_sub_discipline: null, commitment_turn: null };
}

export function isUndeclared(specialisation: Specialisation): boolean {
  return specialisation.status === 'undeclared';
}

export function isCommitted(specialisation: Specialisation): boolean {
  return specialisation.status === 'committed';
}

export function currentSubDiscipline(specialisation: Specialisation): string | null {
  return specialisation.current_sub_discipline;
}
