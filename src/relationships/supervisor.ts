// Supervisor archetypes (specification §4.5).
//
// The six archetypes each shape the PhD stage differently, trading research
// progress, wellbeing, and reputation. Effects apply only during the PhD stage.
// Archetype flavour content (`065`) and specialisation commitment (`038`) are
// handled elsewhere. Functions return a new state; inputs are not mutated.

import type { SaveGame } from '../state/save';
import type { Stage } from '../calendar/stages';

export type SupervisorArchetype =
  | 'supportive_mentor'
  | 'hands_off'
  | 'micromanager'
  | 'status_driven'
  | 'absent'
  | 'exploitative';

export const SUPERVISOR_ARCHETYPES: readonly SupervisorArchetype[] = [
  'supportive_mentor',
  'hands_off',
  'micromanager',
  'status_driven',
  'absent',
  'exploitative',
];

export interface SupervisorEffect {
  // Per-PhD-turn changes the archetype imposes.
  researchBonus: number; // added to methods expertise
  wellbeingDelta: number; // added to mood
  reputationDelta: number; // added to reputation
}

export const SUPERVISOR_EFFECTS: Record<SupervisorArchetype, SupervisorEffect> = {
  supportive_mentor: { researchBonus: 2, wellbeingDelta: 2, reputationDelta: 1 },
  hands_off: { researchBonus: 0, wellbeingDelta: 0, reputationDelta: 0 },
  micromanager: { researchBonus: 2, wellbeingDelta: -3, reputationDelta: 1 },
  status_driven: { researchBonus: 1, wellbeingDelta: -2, reputationDelta: 3 },
  absent: { researchBonus: -2, wellbeingDelta: 0, reputationDelta: -1 },
  exploitative: { researchBonus: 3, wellbeingDelta: -4, reputationDelta: 2 },
};

export function supervisorEffect(archetype: SupervisorArchetype): SupervisorEffect {
  return SUPERVISOR_EFFECTS[archetype];
}

// Apply the supervisor's effect for one turn. Outside the PhD stage there is no
// effect (the supervisor relationship is consequential during the PhD).
export function applySupervisorTurn(
  state: SaveGame,
  archetype: SupervisorArchetype,
  stage: Stage,
): SaveGame {
  if (stage !== 'phd') return state;
  const effect = SUPERVISOR_EFFECTS[archetype];
  const expertise = {
    ...state.player.expertise,
    methods: state.player.expertise.methods + effect.researchBonus,
  };
  const wellbeing = {
    ...state.player.wellbeing,
    mood: state.player.wellbeing.mood + effect.wellbeingDelta,
  };
  const standing = {
    ...state.player.standing,
    reputation: state.player.standing.reputation + effect.reputationDelta,
  };
  return { ...state, player: { ...state.player, expertise, wellbeing, standing } };
}
