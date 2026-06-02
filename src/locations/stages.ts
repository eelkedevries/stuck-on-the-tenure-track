// Career-stage variation of the board (specification §3, §4.11; prompt 083).
//
// The locations stay the same across the career, but what you do there and the
// pressures change: the lab moves from running a study, to analysing data and
// supervising, to managing a lab and chasing ethics. This is a data-driven map
// (stage × location → actions + focus label); unmapped stage/location pairs fall
// back to the location's base actions and a default focus.

import type { Stage } from '../calendar/stages';
import { LOCATIONS, type LocationId } from './types';
import type { ActionCategory } from '../engine/actions';

interface StageLocation {
  actions: ActionCategory[];
  focus: string;
}

// Default focus shown when a stage does not override a location.
const DEFAULT_FOCUS: Record<LocationId, string> = {
  office: 'Write, admin, and grants',
  lab: 'Run studies',
  library: 'Read and sharpen methods',
  classroom: 'Teach and grade',
  seminar_room: 'Talks and committees',
  cafe_pub: 'Informal networking',
  home: 'Rest and quiet writing',
  conference_venue: 'Present and network',
  funder_portal: 'Grant submission',
  gym_outdoors: 'Recover',
  health_centre: 'Look after yourself',
};

const OVERRIDES: Partial<Record<Stage, Partial<Record<LocationId, StageLocation>>>> = {
  phd: {
    lab: { actions: ['research'], focus: 'Run studies' },
    office: { actions: ['research', 'service'], focus: 'Write your thesis' },
    classroom: { actions: ['teaching'], focus: 'TA work' },
    seminar_room: { actions: ['networking'], focus: 'Attend talks' },
    funder_portal: { actions: ['funding'], focus: 'Small grants' },
    cafe_pub: { actions: ['networking', 'personal'], focus: 'Peer support' },
    home: { actions: ['personal', 'research'], focus: 'Recover, and feel thesis guilt' },
  },
  postdoc: {
    lab: { actions: ['research'], focus: 'Analyse data, supervise an RA' },
    office: { actions: ['research', 'funding', 'service'], focus: 'Papers and fellowships' },
    classroom: { actions: ['teaching'], focus: 'Guest lecture' },
    seminar_room: { actions: ['networking', 'service'], focus: 'Present your work' },
    funder_portal: { actions: ['funding'], focus: 'Fellowships' },
    cafe_pub: { actions: ['networking', 'personal'], focus: 'Collaborations' },
    home: { actions: ['personal', 'research'], focus: 'Relocation stress' },
  },
  assistant_professor: {
    lab: { actions: ['research', 'service'], focus: 'Manage the lab, chase ethics' },
    office: { actions: ['service', 'funding', 'research'], focus: 'Admin, grants, reviewer reports' },
    classroom: { actions: ['teaching'], focus: 'Teach a module' },
    seminar_room: { actions: ['networking', 'service'], focus: 'Committees and recruitment' },
    funder_portal: { actions: ['funding'], focus: 'ERC / NWO-style grants' },
    cafe_pub: { actions: ['networking', 'personal'], focus: 'Department politics' },
    home: { actions: ['personal', 'research'], focus: 'Manage the work–life collapse' },
  },
};

export function actionsAtStage(stage: Stage, id: LocationId): ActionCategory[] {
  return OVERRIDES[stage]?.[id]?.actions ?? [...LOCATIONS[id].actions];
}

export function focusAtStage(stage: Stage, id: LocationId): string {
  return OVERRIDES[stage]?.[id]?.focus ?? DEFAULT_FOCUS[id];
}
