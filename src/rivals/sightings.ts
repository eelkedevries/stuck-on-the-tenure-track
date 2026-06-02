// Rival sightings (specification §4.9; prompt 082).
//
// Lightweight, in-world rival presence derived from the existing rival state and
// where the player spent the turn — a rival seen in the seminar room or at a
// conference, working late in the lab, or rumoured to have published again. No
// rival pathfinding or movement: this only surfaces existing state as flavour.
// The full comparison view remains the cohort tracker (`047`).

import type { Rival } from './simulation';
import type { LocationId } from '../locations/types';

export interface Sighting {
  rival: string;
  text: string;
}

const SOCIAL: LocationId[] = ['seminar_room', 'conference_venue', 'cafe_pub'];

export function rivalSighting(
  rivals: Rival[],
  visited: LocationId[],
  rng: () => number = Math.random,
): Sighting | null {
  const active = rivals.filter((r) => r.rank !== 'tenured');
  if (active.length === 0) return null;
  const pick = active[Math.floor(rng() * active.length)];

  // Seen in person where the player showed up.
  const socialVisited = visited.filter((v) => SOCIAL.includes(v));
  if (socialVisited.length > 0 && rng() < 0.5) {
    const loc = socialVisited[Math.floor(rng() * socialVisited.length)];
    const text =
      loc === 'seminar_room'
        ? `${pick.name} was in the seminar room, asking a question that was really a statement.`
        : loc === 'conference_venue'
          ? `Spotted ${pick.name} holding court at the conference.`
          : `Overheard at the café that ${pick.name} has something in press.`;
    return { rival: pick.name, text };
  }

  if (visited.includes('lab') && rng() < 0.3) {
    return { rival: pick.name, text: `${pick.name} was still in the lab when you left. Again.` };
  }

  // Otherwise, the occasional rumour about whoever is most prolific.
  if (rng() < 0.25) {
    const prolific = [...active].sort((a, b) => b.publications - a.publications)[0];
    return { rival: prolific.name, text: `Word is ${prolific.name} has published again. Of course.` };
  }

  return null;
}
