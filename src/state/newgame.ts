// New-game bootstrap (specification §4.1, §4.9, §8).
//
// Builds a valid starting SaveGame and an initial cohort of three rivals,
// seeded deterministically from the game seed so a given seed always produces
// the same opening. No fields are added beyond the existing save schema; this
// is glue between the schema, the rivals, and the playable flow (073).

import type { SaveGame } from './save';
import type { Rival } from '../rivals/simulation';
import type { Npc } from '../relationships/types';
import { RIVAL_ARCHETYPES } from '../rivals/archetypes';
import { TURN_TIME_POINTS } from '../engine/actions';
import { SAVE_VERSION } from './serialise';

// The starting relationships a career opens with. They decay if neglected
// (specification §4.5), giving the personal/networking actions something to
// maintain.
function createInitialRelationships(): Npc[] {
  const base = {
    relationship_score: 70,
    relationship_status: 'active' as const,
    last_interaction_turn: 0,
    persistent: true,
    shared_papers: [] as string[],
    notes: '',
  };
  return [
    { npc_id: 'npc-supervisor', name: 'Prof. E. Visser', gender: 'unspecified', role_relative_to_player: 'supervisor', ...base },
    { npc_id: 'npc-partner', name: 'Sam', gender: 'unspecified', role_relative_to_player: 'partner', ...base },
    { npc_id: 'npc-collaborator', name: 'Dr K. Lindqvist', gender: 'unspecified', role_relative_to_player: 'collaborator', ...base },
    { npc_id: 'npc-friend', name: 'Niamh', gender: 'unspecified', role_relative_to_player: 'friend', ...base },
  ];
}

// A small deterministic PRNG (FNV-1a seed → Lehmer generator), so a seed string
// yields a repeatable sequence without pulling in a dependency.
function seededRng(seed: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let s = h >>> 0 || 1;
  return () => {
    s = Math.imul(s, 16807) % 2147483647;
    if (s <= 0) s += 2147483646;
    return s / 2147483647;
  };
}

// Three starting rivals, drawn from the cohort the player matriculates with.
function createInitialRivals(seed: string): Rival[] {
  const rng = seededRng(`${seed}:rivals`);
  const names = ['A. Bakker', 'C. Moreau', 'R. Patel'];
  return names.map((name, i) => ({
    rival_id: `rival-${i + 1}`,
    name,
    archetype: RIVAL_ARCHETYPES[Math.floor(rng() * RIVAL_ARCHETYPES.length)],
    rank: 'undergraduate',
    publications: 0,
    h_index: 0,
    affiliation_prestige: 40 + Math.floor(rng() * 20),
    recent_event: null,
    wellbeing: 60,
    committed_misconduct: false,
  }));
}

export interface NewGame {
  state: SaveGame;
  rivals: Rival[];
}

// Build a fresh game. The rivals are also embedded in `state.rivals` so a saved
// game round-trips the whole cohort (specification §8).
export function createNewGame(seed: string = `beta-${Date.now()}`): NewGame {
  const now = new Date().toISOString();
  const rivals = createInitialRivals(seed);
  const state: SaveGame = {
    save_version: SAVE_VERSION,
    game_seed: seed,
    created_at: now,
    last_played_at: now,
    calendar: { current_date: '2026-09-01', turn_number: 0, start_date: '2026-09-01' },
    settings: { spelling: 'en-GB', light_narrative_mode: false },
    player: {
      name: 'You',
      gender: 'unspecified',
      broad_discipline: 'psychology',
      funds: { personal: 1200, research: 0 },
      wellbeing: { sleep: 70, mood: 70, physical: 70, stress: 20 },
      expertise: { methods: 2, theory: 2, writing: 2, statistics: 2, teaching: 0, politics: 0 },
      standing: { rank: 'undergraduate', reputation: 5, affiliation_prestige: 40 },
      specialisation: { status: 'undeclared', current_sub_discipline: null, commitment_turn: null },
      imposter_state: { perceived_competence: 40, actual_competence: 45 },
      health_conditions: [],
      papers: [],
      grants_held: [],
      grants_applied: [],
      relationships: createInitialRelationships() as unknown as SaveGame['player']['relationships'],
      milestones_completed: [],
      location_visits: [],
    },
    board: { current_location: 'office', time_remaining: TURN_TIME_POINTS },
    deadlines: [],
    rivals: rivals as unknown as SaveGame['rivals'],
    events_history: [],
  };
  return { state, rivals };
}
