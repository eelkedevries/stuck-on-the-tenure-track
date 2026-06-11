// Campus moments (specification §2 tone, §4.11 board interaction).
//
// Small things that happen when you walk into a place: free pizza, a dead
// laptop, the head of department remembering your name. They fire on the
// player's first arrival at a location in a term, with a modest probability,
// and apply light event-style effects immediately. They are the mid-term
// counterpart of turn-start events — variance while the clock runs, so a term
// never plays out exactly as planned. Cosmetically surfaced as a board flash;
// nothing here persists beyond the ordinary game state.

import type { LocationId } from '../locations/types';
import type { Stage } from '../calendar/stages';
import type { EventEffects } from '../content/types';

export type MomentTone = 'good' | 'bad' | 'neutral';

export interface Moment {
  id: string;
  // Board location this moment belongs to, or 'any' for the shared pool.
  location: LocationId | 'any';
  stages?: Stage[];
  text: string;
  effects?: EventEffects;
  tone: MomentTone;
}

const RESEARCH_STAGES: Stage[] = ['phd', 'postdoc', 'assistant_professor'];
const STUDENT_STAGES: Stage[] = ['undergraduate', 'msc'];

export const MOMENTS: Moment[] = [
  // — Office —
  { id: 'office_pizza', location: 'office', text: 'Leftover seminar pizza in the kitchen. Cold, free, magnificent.', effects: { mood: 3 }, tone: 'good' },
  { id: 'office_printer', location: 'office', text: 'The printer eats your document and declares a paper jam in a language of lights.', effects: { stress: 3 }, tone: 'bad' },
  { id: 'office_chair_nod', location: 'office', text: 'The head of department greets you by name. Your actual name.', effects: { reputation: 1, mood: 2 }, tone: 'good' },
  { id: 'office_email_avalanche', location: 'office', text: 'Forty-one new emails. Three matter. You read all forty-one.', effects: { stress: 2 }, tone: 'bad' },
  // — Lab —
  { id: 'lab_clean_data', location: 'lab', stages: RESEARCH_STAGES, text: 'A participant no-show frees an hour, and the pilot data look suspiciously clean.', effects: { mood: 2, methods: 1 }, tone: 'good' },
  { id: 'lab_freezer', location: 'lab', stages: RESEARCH_STAGES, text: 'The freezer alarm went off overnight. Tessa fixed it. You owe Tessa.', effects: { stress: 2 }, tone: 'bad' },
  { id: 'lab_equipment', location: 'lab', text: 'The new eye-tracker works first time. Nobody knows why. Nobody asks.', effects: { mood: 2 }, tone: 'good' },
  // — Library —
  { id: 'library_book', location: 'library', text: 'The exact book you needed is on the returns trolley, still warm.', effects: { theory: 1, mood: 2 }, tone: 'good' },
  { id: 'library_fine', location: 'library', text: 'Mags waves a fine at you: the inter-library loan from two years ago.', effects: { personal_funds: -15 }, tone: 'bad' },
  { id: 'library_nap', location: 'library', text: 'Someone is asleep in your favourite chair. There are other chairs. It is the principle.', effects: { mood: -1 }, tone: 'neutral' },
  // — Lecture hall —
  { id: 'class_compliment', location: 'classroom', text: 'A student says your explanation finally made it click. You float out.', effects: { mood: 3, teaching: 1 }, tone: 'good' },
  { id: 'class_projector', location: 'classroom', text: 'The projector demands a dongle that has never existed.', effects: { stress: 3 }, tone: 'bad' },
  { id: 'class_freebie', location: 'classroom', stages: STUDENT_STAGES, text: 'A society stall is giving out free doughnuts to anyone who pretends to join.', effects: { mood: 2 }, tone: 'good' },
  // — Seminar room —
  { id: 'seminar_biscuits', location: 'seminar_room', text: 'The good biscuits are out. Someone important must be visiting.', effects: { mood: 2 }, tone: 'good' },
  { id: 'seminar_volunteered', location: 'seminar_room', text: 'You arrive late and discover you have been volunteered for a working group.', effects: { stress: 3, politics: 1 }, tone: 'bad' },
  // — Café / pub —
  { id: 'cafe_freecoffee', location: 'cafe_pub', text: 'Bram slides you one on the house. "You look like a deadline," he says.', effects: { mood: 3 }, tone: 'good' },
  { id: 'cafe_gossip', location: 'cafe_pub', text: 'You overhear exactly who is on the hiring committee. Useful.', effects: { politics: 1 }, tone: 'good' },
  { id: 'cafe_round', location: 'cafe_pub', text: 'Old friends at the bar. Somehow, inevitably, you buy the round.', effects: { personal_funds: -20, mood: 2 }, tone: 'neutral' },
  // — Conference —
  { id: 'conf_bigname', location: 'conference_venue', stages: RESEARCH_STAGES, text: 'A big name nods at your lanyard. "Ah, I reviewed you," they say, ambiguously.', effects: { reputation: 1, stress: 2 }, tone: 'neutral' },
  { id: 'conf_totebag', location: 'conference_venue', text: 'You acquire a fourth tote bag. The tote bags now have a tote bag.', effects: { mood: 1 }, tone: 'good' },
  // — Funder portal —
  { id: 'portal_outage', location: 'funder_portal', text: 'PORTAL-9 is down for scheduled unscheduled maintenance.', effects: { stress: 2 }, tone: 'bad' },
  { id: 'portal_extension', location: 'funder_portal', text: 'The call deadline quietly slips a week. A stay of execution, gratefully received.', effects: { stress: -3 }, tone: 'good' },
  // — Home / apartment —
  { id: 'home_parcel', location: 'home', text: 'Mrs Boekema took in a parcel: a care package from home, with biscuits.', effects: { mood: 3 }, tone: 'good' },
  { id: 'home_boiler', location: 'home', text: 'The boiler is making the noise again. The cold shower builds character, allegedly.', effects: { mood: -2 }, tone: 'bad' },
  { id: 'home_laptop', location: 'home', stages: STUDENT_STAGES, text: 'Your laptop charger dies with a small, final pop. A new one is not optional.', effects: { personal_funds: -30, stress: 2 }, tone: 'bad' },
  { id: 'flat_quiet', location: 'upscale_home', text: 'The flat is warm, quiet, and entirely free of undergraduates.', effects: { sleep: 2, mood: 2 }, tone: 'good' },
  // — Gym / parks / health —
  { id: 'gym_pb', location: 'gym_outdoors', text: 'A small personal best. Coach Vik nods once, which is his standing ovation.', effects: { physical: 2, mood: 2 }, tone: 'good' },
  { id: 'park_sun', location: 'park_west', text: 'Unscheduled sunshine. The pigeons convene in your honour.', effects: { mood: 3, stress: -2 }, tone: 'good' },
  { id: 'park_heron', location: 'park_east', text: 'A heron stands motionless in the shallows, reviewing the river. It approves.', effects: { stress: -3 }, tone: 'good' },
  { id: 'health_queue', location: 'health_centre', text: 'The waiting room queue moves with geological patience.', effects: { stress: 1 }, tone: 'neutral' },
  // — Anywhere —
  { id: 'any_idea', location: 'any', text: 'An idea arrives, unprompted, between one door and the next. You write it on your hand.', effects: { theory: 1, mood: 1 }, tone: 'good' },
  { id: 'any_rain', location: 'any', text: 'It starts raining exactly as you step outside. Of course it does.', effects: { mood: -1 }, tone: 'neutral' },
  { id: 'any_tenner', location: 'any', text: 'A tenner on the pavement. The universe pays its debts in small instalments.', effects: { personal_funds: 10, mood: 1 }, tone: 'good' },
  { id: 'any_alumni_call', location: 'any', stages: STUDENT_STAGES, text: 'The alumni office rings to ask for money. You explain you are the reason others should give.', effects: { mood: 1 }, tone: 'neutral' },
];

// Chance that arriving somewhere produces a moment at all.
const MOMENT_CHANCE = 0.3;

function eligible(moment: Moment, location: LocationId, stage: Stage): boolean {
  if (moment.location !== 'any' && moment.location !== location) return false;
  if (moment.stages && !moment.stages.includes(stage)) return false;
  return true;
}

// Roll for a moment on arrival. Local moments are preferred over the shared
// pool so each place keeps its own flavour.
export function rollMoment(
  location: LocationId,
  stage: Stage,
  rng: () => number = Math.random,
): Moment | null {
  if (rng() > MOMENT_CHANCE) return null;
  const local = MOMENTS.filter((m) => m.location === location && eligible(m, location, stage));
  const shared = MOMENTS.filter((m) => m.location === 'any' && eligible(m, location, stage));
  const pool = local.length > 0 && rng() < 0.75 ? local : shared.length > 0 ? shared : local;
  if (pool.length === 0) return null;
  return pool[Math.floor(rng() * pool.length)];
}
