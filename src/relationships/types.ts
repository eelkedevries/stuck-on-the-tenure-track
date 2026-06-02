// NPC relationship objects (specification §4.5).
//
// Relationships are tracked as individual NPCs. Decay (`035`) and supervisor
// archetypes (`036`) are implemented separately. All fields are
// JSON-serialisable.

export type Gender = 'female' | 'male' | 'non_binary' | 'unspecified';

export type NpcRole =
  | 'partner'
  | 'family'
  | 'friend'
  | 'collaborator'
  | 'supervisor'
  | 'phd_student'
  | 'postdoc'
  | 'colleague';

export type RelationshipStatus = 'active' | 'strained' | 'distant' | 'ended';

export interface Npc {
  npc_id: string;
  name: string;
  gender: Gender;
  role_relative_to_player: NpcRole;
  relationship_score: number;
  relationship_status: RelationshipStatus;
  last_interaction_turn: number;
  persistent: boolean;
  shared_papers: string[];
  notes: string;
}
