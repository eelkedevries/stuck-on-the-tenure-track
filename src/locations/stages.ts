// Career-stage variation of the board (specification §3, §4.11; prompts 083, 084).
//
// The locations stay the same across the career, but what you do there changes:
// a student attends lectures, sits exams, and studies; a PhD runs studies and
// writes a thesis; a professor manages a lab and chases grants. Each location
// offers named activities, every one mapping to an existing internal action
// category. Unmapped stage/location pairs fall back to the location's base
// categories with generic labels.

import type { Stage } from '../calendar/stages';
import { LOCATIONS, type LocationId } from './types';
import type { ActionCategory } from '../engine/actions';

export interface Activity {
  label: string;
  category: ActionCategory;
  timeCost?: number;
  effectHint?: string;
  flavour?: string;
}

export interface BoardActivity extends Activity {
  timeCost: number;
  effectHint: string;
}

interface StageLocation {
  focus: string;
  personality?: string;
  activities: Activity[];
}

const DEFAULT_VERB: Record<ActionCategory, string> = {
  research: 'Do research',
  teaching: 'Teach',
  service: 'Service work',
  networking: 'Network',
  funding: 'Work on grants',
  personal: 'Rest',
  misconduct: 'Cut corners',
};

const DEFAULT_TIME_COST: Record<ActionCategory, number> = {
  research: 25,
  teaching: 25,
  service: 20,
  networking: 15,
  funding: 30,
  personal: 20,
  misconduct: 25,
};

const DEFAULT_EFFECT_HINT: Record<ActionCategory, string> = {
  research: 'Build research skill and outputs',
  teaching: 'Gain teaching experience',
  service: 'Earn departmental standing',
  networking: 'Warm up contacts and reputation',
  funding: 'Improve grant prospects',
  personal: 'Recover mood, sleep, and stress',
  misconduct: 'Fast progress, serious risk',
};

const DEFAULT_FLAVOUR: Record<ActionCategory, string> = {
  research: 'A small but real step towards the next line on the CV.',
  teaching: 'Students notice when you are prepared.',
  service: 'The invisible work is, unfortunately, still work.',
  networking: 'A useful conversation beats another unread email.',
  funding: 'Somewhere, a budget spreadsheet becomes marginally less hostile.',
  personal: 'The work will still be there after you breathe.',
  misconduct: 'This may save time now and cost far more later.',
};

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

const DEFAULT_PERSONALITY: Record<LocationId, string> = {
  office: 'The inbox has tenure; you are merely visiting.',
  lab: 'Machines hum, protocols drift, and someone has labelled nothing.',
  library: 'A quiet empire of paywalls, overdue books, and good intentions.',
  classroom: 'The projector negotiates while thirty faces assess your confidence.',
  seminar_room: 'Questions begin as comments and end as autobiography.',
  cafe_pub: 'Collaboration, gossip, and hiring intelligence share a table.',
  home: 'Recovery is possible, provided you ignore the laptop blinking at you.',
  conference_venue: 'Name badges, weak coffee, and strategic enthusiasm under strip lighting.',
  funder_portal: 'Prestige is mandatory; attachments must be both final and resubmitted.',
  gym_outdoors: 'Fresh air makes a polite case against another hour of email.',
  health_centre: 'Forms, triage, and the rare relief of being believed by procedure.',
};

const STAGE_BOARD: Partial<Record<Stage, Partial<Record<LocationId, StageLocation>>>> = {
  undergraduate: {
    classroom: {
      focus: 'Lectures and exams',
      activities: [
        { label: 'Attend a lecture', category: 'research' },
        { label: 'Sit an exam', category: 'research' },
      ],
    },
    library: {
      focus: 'Study and revise',
      activities: [
        { label: 'Study', category: 'research' },
        { label: 'Revise for exams', category: 'research' },
      ],
    },
    seminar_room: {
      focus: 'Tutorials and study groups',
      activities: [
        { label: 'Attend a tutorial', category: 'research' },
        { label: 'Join a study group', category: 'research' },
      ],
    },
    lab: {
      focus: 'Lab practicals',
      activities: [{ label: 'Do a lab practical', category: 'research' }],
    },
    office: {
      focus: 'Coursework and supervision',
      activities: [
        { label: 'Write coursework', category: 'research' },
        { label: 'See your tutor', category: 'networking' },
      ],
    },
    funder_portal: {
      focus: 'Scholarships',
      personality: 'The portal explains need in a dialect of eligibility and prestige.',
      activities: [{ label: 'Look up scholarships', category: 'networking' }],
    },
    home: {
      focus: 'Rest and study',
      personality: 'A duvet, a textbook, and the sense you should be better at both.',
      activities: [
        { label: 'Rest', category: 'personal' },
        { label: 'Study at home', category: 'research' },
      ],
    },
    cafe_pub: {
      focus: 'Student life',
      activities: [
        { label: 'Socialise', category: 'networking' },
        { label: 'Unwind', category: 'personal' },
      ],
    },
  },
  msc: {
    classroom: {
      focus: 'Advanced courses',
      activities: [
        { label: 'Attend a lecture', category: 'research' },
        { label: 'Sit an exam', category: 'research' },
        { label: 'Tutor first-years', category: 'teaching' },
      ],
    },
    library: {
      focus: 'Read and revise',
      activities: [
        { label: 'Read for your thesis', category: 'research' },
        { label: 'Revise for exams', category: 'research' },
      ],
    },
    seminar_room: {
      focus: 'Seminars and lab meetings',
      activities: [
        { label: 'Attend a seminar', category: 'research' },
        { label: 'Present in lab meeting', category: 'networking' },
      ],
    },
    lab: {
      focus: 'Thesis study',
      activities: [{ label: 'Run your thesis study', category: 'research' }],
    },
    office: {
      focus: 'Thesis and supervision',
      activities: [
        { label: 'Write your thesis', category: 'research' },
        { label: 'See your supervisor', category: 'networking' },
      ],
    },
    funder_portal: {
      focus: 'PhD funding',
      personality: 'Every scheme wants potential, excellence, and a PDF named exactly right.',
      activities: [{ label: 'Look up PhD funding', category: 'networking' }],
    },
    home: {
      focus: 'Rest and write',
      personality: 'The kettle offers care; the thesis offers a tab still open.',
      activities: [
        { label: 'Rest', category: 'personal' },
        { label: 'Write at home', category: 'research' },
      ],
    },
    cafe_pub: {
      focus: 'Peer support',
      activities: [
        { label: 'Peer support', category: 'networking' },
        { label: 'Unwind', category: 'personal' },
      ],
    },
  },
  phd: {
    lab: {
      focus: 'Run studies',
      activities: [
        {
          label: 'Run a study',
          category: 'research',
          timeCost: 35,
          effectHint: 'Big push towards research output',
        },
        { label: 'Collect data', category: 'research', timeCost: 30 },
      ],
    },
    office: {
      focus: 'Write your thesis',
      activities: [
        { label: 'Write your thesis', category: 'research' },
        { label: 'Departmental admin', category: 'service' },
      ],
    },
    library: {
      focus: 'Read the literature',
      activities: [{ label: 'Read the literature', category: 'research' }],
    },
    classroom: {
      focus: 'TA work',
      activities: [
        { label: 'Run a tutorial', category: 'teaching' },
        { label: 'Mark coursework', category: 'teaching' },
      ],
    },
    seminar_room: {
      focus: 'Attend talks',
      activities: [{ label: 'Attend a talk', category: 'networking' }],
    },
    funder_portal: {
      focus: 'Small grants',
      personality: 'The portal applauds ambition, then asks for a cost code you do not have.',
      activities: [{ label: 'Apply for a small grant', category: 'funding' }],
    },
    cafe_pub: {
      focus: 'Peer support',
      activities: [
        { label: 'Peer support', category: 'networking' },
        { label: 'Unwind', category: 'personal' },
      ],
    },
    home: {
      focus: 'Recover, and feel thesis guilt',
      personality: 'Rest is allowed, though the thesis has filed an objection.',
      activities: [
        { label: 'Rest', category: 'personal' },
        { label: 'Write at home', category: 'research' },
      ],
    },
  },
  postdoc: {
    lab: {
      focus: 'Analyse data, supervise an RA',
      activities: [
        { label: 'Analyse data', category: 'research' },
        { label: 'Supervise an RA', category: 'service' },
      ],
    },
    office: {
      focus: 'Papers and fellowships',
      activities: [
        { label: 'Write a paper', category: 'research' },
        { label: 'Draft a fellowship', category: 'funding' },
        { label: 'Reviewer reports', category: 'service' },
      ],
    },
    library: {
      focus: 'Read the literature',
      activities: [{ label: 'Read the literature', category: 'research' }],
    },
    classroom: {
      focus: 'Guest lecture',
      activities: [{ label: 'Give a guest lecture', category: 'teaching' }],
    },
    seminar_room: {
      focus: 'Present your work',
      activities: [
        { label: 'Present your work', category: 'networking' },
        { label: 'Committee work', category: 'service' },
      ],
    },
    funder_portal: {
      focus: 'Fellowships',
      personality: 'Independence must be proven in three pages and institutional letterhead.',
      activities: [{ label: 'Apply for a fellowship', category: 'funding' }],
    },
    cafe_pub: {
      focus: 'Collaborations',
      activities: [
        { label: 'Meet a collaborator', category: 'networking' },
        { label: 'Unwind', category: 'personal' },
      ],
    },
    home: {
      focus: 'Relocation stress',
      personality: 'Half the boxes are books; the other half are unresolved career moves.',
      activities: [
        { label: 'Rest', category: 'personal' },
        { label: 'Write at home', category: 'research' },
      ],
    },
  },
  assistant_professor: {
    lab: {
      focus: 'Manage the lab, chase ethics',
      activities: [
        { label: 'Manage the lab', category: 'service' },
        { label: 'Push a study forward', category: 'research' },
        { label: 'Chase ethics approval', category: 'service' },
      ],
    },
    office: {
      focus: 'Admin, grants, reviewer reports',
      activities: [
        { label: 'Write a grant', category: 'funding', timeCost: 35 },
        { label: 'Admin', category: 'service', timeCost: 15 },
        { label: 'Write a paper', category: 'research', timeCost: 30 },
      ],
    },
    library: {
      focus: 'Read the literature',
      activities: [{ label: 'Read the literature', category: 'research' }],
    },
    classroom: {
      focus: 'Teach a module',
      activities: [
        { label: 'Teach your module', category: 'teaching' },
        { label: 'Mark exams', category: 'teaching' },
      ],
    },
    seminar_room: {
      focus: 'Committees and recruitment',
      activities: [
        { label: 'Committee work', category: 'service' },
        { label: 'Recruitment', category: 'networking' },
      ],
    },
    funder_portal: {
      focus: 'ERC / NWO-style grants',
      personality: 'Excellence, impact, feasibility, and one more annex before midnight.',
      activities: [
        {
          label: 'Submit a major grant',
          category: 'funding',
          timeCost: 40,
          effectHint: 'Major grant push',
          flavour: 'Upload, reload, and hope the portal agrees you exist.',
        },
      ],
    },
    cafe_pub: {
      focus: 'Department politics',
      activities: [
        { label: 'Department politics', category: 'networking' },
        { label: 'Unwind', category: 'personal' },
      ],
    },
    home: {
      focus: 'Manage the work–life collapse',
      personality: 'The sofa recognises you, but your calendar has concerns.',
      activities: [
        { label: 'Rest', category: 'personal' },
        { label: 'Catch up on email', category: 'service' },
      ],
    },
  },
};

function defaultActivities(id: LocationId): Activity[] {
  return LOCATIONS[id].actions.map((category) => ({ label: DEFAULT_VERB[category], category }));
}

function withActivityDefaults(activity: Activity): BoardActivity {
  return {
    ...activity,
    timeCost: activity.timeCost ?? DEFAULT_TIME_COST[activity.category],
    effectHint: activity.effectHint ?? DEFAULT_EFFECT_HINT[activity.category],
    flavour: activity.flavour ?? DEFAULT_FLAVOUR[activity.category],
  };
}

export function activitiesAtStage(stage: Stage, id: LocationId): BoardActivity[] {
  const activities = STAGE_BOARD[stage]?.[id]?.activities ?? defaultActivities(id);
  return activities.map(withActivityDefaults);
}

export function focusAtStage(stage: Stage, id: LocationId): string {
  return STAGE_BOARD[stage]?.[id]?.focus ?? DEFAULT_FOCUS[id];
}

export function personalityAtStage(stage: Stage, id: LocationId): string {
  return STAGE_BOARD[stage]?.[id]?.personality ?? DEFAULT_PERSONALITY[id];
}

export function actionsAtStage(stage: Stage, id: LocationId): ActionCategory[] {
  return [...new Set(activitiesAtStage(stage, id).map((a) => a.category))];
}
