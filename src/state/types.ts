// Resource and game-state types (specification §4.1, with specialisation §4.6
// and imposter state §4.7).
//
// All fields are JSON-serialisable primitives, arrays, or plain objects so the
// game state round-trips to JSON without loss (specification §1.3, §8). The
// h-index is deliberately NOT stored here: it is computed from papers by a
// later prompt (`030`, specification §4.1, §4.3).

export interface Funds {
  personal: number;
  research: number;
}

export interface Wellbeing {
  sleep: number;
  mood: number;
  physical: number;
}

export interface Expertise {
  methods: number;
  theory: number;
  writing: number;
  statistics: number;
  teaching: number;
  politics: number;
}

// Career rank, from matriculation to the tenure decision (specification §3).
export type Rank =
  | 'undergraduate'
  | 'msc'
  | 'phd'
  | 'postdoc'
  | 'assistant_professor'
  | 'tenured';

export interface Standing {
  rank: Rank;
  reputation: number;
  affiliation_prestige: number;
}

// Specialisation progresses undeclared → leaning → committed, with a later
// switch possible at significant cost (specification §4.6).
export type SpecialisationStatus =
  | 'undeclared'
  | 'leaning'
  | 'committed'
  | 'switched';

export interface Specialisation {
  status: SpecialisationStatus;
  current_sub_discipline: string | null;
  commitment_turn: number | null;
}

// Imposter subsystem state (specification §4.7). The perceived/actual gap is
// derived, not stored, mirroring the h-index.
export interface ImposterState {
  perceived_competence: number;
  actual_competence: number;
}

// The overall player game-state object. System-specific collections (papers,
// grants, relationships, health conditions, milestones) are added to this
// object by their own prompts as those types are defined.
export interface PlayerState {
  name: string;
  gender: string;
  broad_discipline: string;
  funds: Funds;
  wellbeing: Wellbeing;
  expertise: Expertise;
  standing: Standing;
  specialisation: Specialisation;
  imposter_state: ImposterState;
}
