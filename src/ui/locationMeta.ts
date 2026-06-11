// Player-facing location names, blurbs, and sign colours, shared by the board,
// the location tab, and the appointment strip so every surface calls a place
// the same thing. Engine-side LOCATIONS keeps ids and action bindings; this is
// presentation only.

import type { LocationId } from '../locations/types';

export interface LocationMeta {
  name: string;
  blurb: string;
  // [background, foreground] for the building's name sign and plaque.
  accent: [string, string];
}

export const LOCATION_META: Record<LocationId, LocationMeta> = {
  home:             { name: 'Student room',   blurb: 'Your single room: a bed, a desk, and the quiet hum of impostor syndrome.', accent: ['var(--wellbeing)', '#fff'] },
  upscale_home:     { name: 'Apartment',      blurb: 'A real flat — the reward for surviving the early stages.',                  accent: ['var(--wellbeing)', '#fff'] },
  office:           { name: 'Office',         blurb: 'Shared, draughty, the engine room of a career.',                            accent: ['var(--gold)', '#1a1a1a'] },
  lab:              { name: 'Lab',            blurb: 'Benches, beakers and the faint smell of progress.',                         accent: ['var(--green)', '#fff'] },
  library:          { name: 'Library',        blurb: 'Silence, stacks and strong coffee.',                                        accent: ['var(--green)', '#fff'] },
  classroom:        { name: 'Lecture hall',   blurb: 'Where you teach — and are quietly judged.',                                 accent: ['var(--skill)', '#fff'] },
  seminar_room:     { name: 'Seminar room',   blurb: 'Round-table country.',                                                      accent: ['var(--standing)', '#fff'] },
  cafe_pub:         { name: 'Café / pub',     blurb: 'Caffeine and gossip, the true currencies of academia.',                     accent: ['var(--standing)', '#fff'] },
  conference_venue: { name: 'Conference',     blurb: 'Lanyards, name-dropping and the occasional genuinely good idea.',           accent: ['var(--skill)', '#fff'] },
  funder_portal:    { name: 'Funder portal',  blurb: 'Ninety pages so a panel can say "not this round".',                        accent: ['var(--gold)', '#1a1a1a'] },
  gym_outdoors:     { name: 'Gym',            blurb: 'Your body, briefly remembered.',                                            accent: ['var(--wellbeing)', '#fff'] },
  health_centre:    { name: 'Health centre',  blurb: 'The GP will tell you to rest.',                                              accent: ['var(--danger)', '#fff'] },
  park_west:        { name: 'Campus green',   blurb: 'Green space. Pigeons, a bench, and ten honest minutes.',                    accent: ['var(--green-d)', '#fff'] },
  park_east:        { name: 'Riverside walk', blurb: 'The river path. Ducks, reeds, and a rare clear thought.',                   accent: ['var(--green-d)', '#fff'] },
};

export function locationName(id: LocationId | string): string {
  return LOCATION_META[id as LocationId]?.name ?? String(id);
}
