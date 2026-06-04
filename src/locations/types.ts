// Location model (specification §4.11).
//
// Actions are taken at locations. Each location binds a set of action
// categories and is flagged for visibility relevance (used by the ghost
// penalty, `053`). The desktop map (`051`) and mobile list (`052`) render these
// locations; this module is the data model. All values are JSON-serialisable.

import type { ActionCategory } from '../engine/actions';

export type LocationId =
  | 'office'
  | 'lab'
  | 'library'
  | 'classroom'
  | 'seminar_room'
  | 'cafe_pub'
  | 'home'
  | 'upscale_home'
  | 'conference_venue'
  | 'funder_portal'
  | 'gym_outdoors'
  | 'health_centre'
  | 'park_west'
  | 'park_east';

export interface GameLocation {
  id: LocationId;
  name: string;
  actions: ActionCategory[];
  // Whether being seen here contributes to academic visibility/reputation.
  visibilityRelevant: boolean;
}

export const LOCATIONS: Record<LocationId, GameLocation> = {
  office: { id: 'office', name: 'Office', actions: ['research', 'service', 'funding'], visibilityRelevant: true },
  lab: { id: 'lab', name: 'Lab', actions: ['research'], visibilityRelevant: false },
  library: { id: 'library', name: 'Library', actions: ['research'], visibilityRelevant: false },
  classroom: { id: 'classroom', name: 'Classroom', actions: ['teaching'], visibilityRelevant: true },
  seminar_room: { id: 'seminar_room', name: 'Seminar room', actions: ['networking', 'service'], visibilityRelevant: true },
  cafe_pub: { id: 'cafe_pub', name: 'Café / pub', actions: ['networking', 'personal'], visibilityRelevant: true },
  home: { id: 'home', name: 'Student room', actions: ['personal', 'research'], visibilityRelevant: false },
  upscale_home: { id: 'upscale_home', name: 'Apartment', actions: ['personal', 'research'], visibilityRelevant: false },
  conference_venue: { id: 'conference_venue', name: 'Conference venue', actions: ['networking', 'research'], visibilityRelevant: true },
  funder_portal: { id: 'funder_portal', name: 'Funder portal', actions: ['funding'], visibilityRelevant: false },
  gym_outdoors: { id: 'gym_outdoors', name: 'Gym / outdoors', actions: ['personal'], visibilityRelevant: false },
  health_centre: { id: 'health_centre', name: 'GP / therapist / occupational health', actions: ['personal'], visibilityRelevant: false },
  park_west: { id: 'park_west', name: 'Campus green', actions: ['personal'], visibilityRelevant: false },
  park_east: { id: 'park_east', name: 'Riverside walk', actions: ['personal'], visibilityRelevant: false },
};

export const ALL_LOCATIONS: readonly GameLocation[] = Object.values(LOCATIONS);

export function actionsAt(id: LocationId): ActionCategory[] {
  return LOCATIONS[id].actions;
}

export function locationsForAction(category: ActionCategory): GameLocation[] {
  return ALL_LOCATIONS.filter((location) => location.actions.includes(category));
}

export function visibilityLocations(): GameLocation[] {
  return ALL_LOCATIONS.filter((location) => location.visibilityRelevant);
}
