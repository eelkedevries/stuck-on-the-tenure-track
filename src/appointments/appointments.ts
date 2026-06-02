// Timed appointments (specification §4.11a, §3; prompt 091).
//
// Within-turn commitments — a lecture, an exam, a grant interview — that require
// the player to be at a location by a point on the turn clock. They are
// scheduled by career stage at the start of a turn (not every turn) and resolved
// as the clock advances: present → attended, absent → missed. They run on the
// time-point clock and are distinct from the calendar-scale deadlines.

import type { LocationId } from '../locations/types';
import type { Stage } from '../calendar/stages';

export type AppointmentType = 'lecture' | 'exam' | 'meeting' | 'grant_interview';
export type AppointmentStatus = 'pending' | 'attended' | 'missed';

export interface Appointment {
  appointment_id: string;
  title: string;
  location: LocationId;
  type: AppointmentType;
  at_tp: number; // time-point in the turn by which the player must be there
  status: AppointmentStatus;
}

interface Template {
  title: string;
  location: LocationId;
  type: AppointmentType;
}

const TEMPLATES: Record<Stage, Template[]> = {
  undergraduate: [
    { title: 'A lecture you must attend', location: 'classroom', type: 'lecture' },
    { title: 'An exam', location: 'classroom', type: 'exam' },
  ],
  msc: [
    { title: 'A core lecture', location: 'classroom', type: 'lecture' },
    { title: 'An exam', location: 'classroom', type: 'exam' },
    { title: 'Supervision meeting', location: 'office', type: 'meeting' },
  ],
  phd: [
    { title: 'Supervision meeting', location: 'office', type: 'meeting' },
    { title: 'Lab meeting', location: 'lab', type: 'meeting' },
  ],
  postdoc: [
    { title: 'A job talk to attend', location: 'seminar_room', type: 'meeting' },
    { title: 'Grant interview', location: 'funder_portal', type: 'grant_interview' },
  ],
  assistant_professor: [
    { title: 'Grant interview', location: 'funder_portal', type: 'grant_interview' },
    { title: 'Faculty committee', location: 'seminar_room', type: 'meeting' },
  ],
};

// Roughly 45% of turns carry one appointment, to create pressure without
// constant crisis.
export function scheduleAppointments(
  stage: Stage,
  turn: number,
  rng: () => number = Math.random,
): Appointment[] {
  const options = TEMPLATES[stage];
  if (!options || options.length === 0 || rng() > 0.45) return [];
  const t = options[Math.floor(rng() * options.length)];
  const at_tp = 20 + Math.floor(rng() * 45); // 20..64
  return [
    {
      appointment_id: `appt-${turn}`,
      title: t.title,
      location: t.location,
      type: t.type,
      at_tp,
      status: 'pending',
    },
  ];
}
