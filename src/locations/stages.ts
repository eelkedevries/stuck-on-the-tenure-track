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
import type { EventEffects } from '../content/types';

type RoutineBoardCategory = Exclude<ActionCategory, 'misconduct'>;

// A push-your-luck activity: the outcome is rolled the moment it is taken,
// applying either the win or the lose effects (any stake goes through `cash`).
export interface ActivityGamble {
  odds: number; // probability of the win outcome, 0..1
  win: EventEffects;
  lose: EventEffects;
  winText: string;
  loseText: string;
}

export interface Activity {
  id?: string;
  label: string;
  category: ActionCategory;
  timeCost?: number;
  effectHint?: string;
  flavour?: string;
  // Cash flow when the activity is taken: positive pays (bar shifts, tutoring),
  // negative costs (rounds, fees, memberships). Applied immediately by the
  // store; omitted means free.
  cash?: number;
  gamble?: ActivityGamble;
  // Optional per-activity effect labels; defaults derive from the category.
  positiveEffects?: string[];
  negativeEffects?: string[];
}

export interface BoardActivity extends Activity {
  id: string;
  timeCost: number;
  effectHint: string;
  cash: number;
  positiveEffects: string[];
  negativeEffects: string[];
  badge?: string;
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
  misconduct: 'Risk cutting corners',
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
  research: 'Advance the stage goal and research skill',
  teaching: 'Gain teaching experience',
  service: 'Earn departmental standing',
  networking: 'Build contacts and visible reputation',
  funding: 'Improve grant prospects',
  personal: 'Lower stress; protect sleep and mood',
  misconduct: 'Contextual shortcut; serious detection risk',
};

const DEFAULT_POSITIVE_EFFECTS: Record<ActionCategory, string[]> = {
  research: ['Skill +', 'Career +'],
  teaching: ['Teaching +', 'Standing +'],
  service: ['Standing +'],
  networking: ['Contacts +', 'Reputation +'],
  funding: ['Grant chance +', 'Career +'],
  personal: ['Wellbeing +', 'Stress −'],
  misconduct: ['Short-term progress +'],
};

const DEFAULT_NEGATIVE_EFFECTS: Record<ActionCategory, string[]> = {
  research: ['Stress +', 'Sleep −'],
  teaching: ['Stress +', 'Prep time −'],
  service: ['Time −', 'Energy −'],
  networking: ['Energy −'],
  funding: ['Stress +', 'Rejection risk'],
  personal: ['Career pace −'],
  misconduct: ['Detection risk', 'Standing −'],
};

const DEFAULT_FLAVOUR: Record<ActionCategory, string> = {
  research: 'A small but real step towards the next line on the CV.',
  teaching: 'Students notice when you are prepared.',
  service: 'The invisible work is, unfortunately, still work.',
  networking: 'A useful conversation beats another unread email.',
  funding: 'Somewhere, a budget spreadsheet becomes marginally less hostile.',
  personal: 'The work will still be there after you breathe.',
  misconduct: 'This is cutting corners: faster now, with consequences if anyone looks closely.',
};

const DEFAULT_FOCUS: Record<LocationId, string> = {
  office: 'Write, admin, and grants',
  lab: 'Run studies',
  library: 'Read and sharpen methods',
  classroom: 'Teach and grade',
  seminar_room: 'Talks and committees',
  cafe_pub: 'Informal networking',
  home: 'Rest and quiet writing',
  upscale_home: 'Rest in comfort',
  conference_venue: 'Present and network',
  funder_portal: 'Grant submission',
  gym_outdoors: 'Recover',
  health_centre: 'Look after yourself',
  park_west: 'Clear your head',
  park_east: 'A quiet walk',
};

const DEFAULT_PERSONALITY: Record<LocationId, string> = {
  office: 'The inbox has tenure; you are merely visiting.',
  lab: 'Machines hum, protocols drift, and someone has labelled nothing.',
  library: 'A quiet empire of paywalls, overdue books, and good intentions.',
  classroom: 'The projector negotiates while thirty faces assess your confidence.',
  seminar_room: 'Questions begin as comments and end as autobiography.',
  cafe_pub: 'Collaboration, gossip, and hiring intelligence share a table.',
  home: 'Recovery is possible, provided you ignore the laptop blinking at you.',
  upscale_home: 'A real flat — the reward for surviving the early stages.',
  conference_venue: 'Name badges, weak coffee, and strategic enthusiasm under strip lighting.',
  funder_portal: 'Prestige is mandatory; attachments must be both final and resubmitted.',
  gym_outdoors: 'Fresh air makes a polite case against another hour of email.',
  health_centre: 'Forms, triage, and the rare relief of being believed by procedure.',
  park_west: 'Pigeons, a bench, and ten honest minutes.',
  park_east: 'The river path. Ducks, reeds, and a rare clear thought.',
};

// The pub's standing flutter: a tenner in, perhaps sixty out. Available at
// every stage, because the quiz machine outlives all careers.
const PUB_QUIZ: Activity = {
  label: 'Pub quiz night',
  category: 'personal',
  timeCost: 10,
  cash: -10,
  effectHint: 'A flutter: £10 in, maybe £60 out',
  flavour: 'Your specialist subject is, regrettably, your actual specialist subject.',
  positiveEffects: ['Maybe £60', 'Mood +'],
  negativeEffects: ['Cash −'],
  gamble: {
    odds: 0.35,
    win: { personal_funds: 60, mood: 3 },
    lose: { mood: 1 },
    winText: 'Your table wins the pub quiz. Glory, and £60 behind the bar.',
    loseText: 'Second place, again, to the retired geographers.',
  },
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
      focus: 'Student life — and shifts that pay the rent',
      activities: [
        { label: 'Socialise', category: 'networking', cash: -15, flavour: 'Your round. It is always somehow your round.' },
        { label: 'Unwind', category: 'personal', cash: -10 },
        {
          label: 'Shift behind the bar',
          category: 'service',
          timeCost: 20,
          cash: 90,
          effectHint: 'Paid work: cash now, time gone',
          flavour: 'Cash in hand, sore feet, and a working knowledge of who fancies whom.',
          positiveEffects: ['Cash +'],
          negativeEffects: ['Time −', 'Energy −'],
        },
        PUB_QUIZ,
      ],
    },
    conference_venue: {
      focus: 'Student helper work',
      activities: [
        {
          label: 'Volunteer as a student helper',
          category: 'service',
          timeCost: 20,
          cash: 50,
          effectHint: 'Paid helper shift; you see how the game works',
          flavour: 'Point lost professors at the right room and pocket the honorarium.',
          positiveEffects: ['Cash +', 'Contacts +'],
          negativeEffects: ['Time −'],
        },
        { label: 'Sneak into the talks', category: 'research', timeCost: 15 },
      ],
    },
  },
  msc: {
    classroom: {
      focus: 'Advanced courses',
      activities: [
        { label: 'Attend a lecture', category: 'research' },
        { label: 'Sit an exam', category: 'research' },
        {
          label: 'Tutor first-years',
          category: 'teaching',
          cash: 85,
          effectHint: 'Paid teaching: cash plus teaching experience',
          positiveEffects: ['Cash +', 'Teaching +'],
          negativeEffects: ['Time −'],
        },
      ],
    },
    library: {
      focus: 'Read and revise',
      activities: [
        { label: 'Read for your thesis', category: 'research' },
        { label: 'Revise for exams', category: 'research' },
        {
          label: 'Invigilate an exam',
          category: 'service',
          timeCost: 15,
          cash: 80,
          effectHint: 'Paid work: watch people write for three hours',
          flavour: 'No phones, no talking, and £80 for supervising existential dread.',
          positiveEffects: ['Cash +'],
          negativeEffects: ['Tedium +'],
        },
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
      focus: 'Peer support — and shifts that pay the rent',
      activities: [
        { label: 'Peer support', category: 'networking', cash: -15 },
        { label: 'Unwind', category: 'personal', cash: -10 },
        {
          label: 'Shift behind the bar',
          category: 'service',
          timeCost: 20,
          cash: 95,
          effectHint: 'Paid work: cash now, time gone',
          flavour: 'The regulars ask about the thesis. You change the subject professionally.',
          positiveEffects: ['Cash +'],
          negativeEffects: ['Time −', 'Energy −'],
        },
        PUB_QUIZ,
      ],
    },
    conference_venue: {
      focus: 'Student helper work',
      activities: [
        {
          label: 'Volunteer as a student helper',
          category: 'service',
          timeCost: 20,
          cash: 50,
          effectHint: 'Paid helper shift; you see how the game works',
          positiveEffects: ['Cash +', 'Contacts +'],
          negativeEffects: ['Time −'],
        },
        { label: 'Sneak into the talks', category: 'research', timeCost: 15 },
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
      activities: [
        { label: 'Read the literature', category: 'research' },
        {
          label: 'Invigilate an exam',
          category: 'service',
          timeCost: 15,
          cash: 80,
          effectHint: 'Paid work: watch people write for three hours',
          positiveEffects: ['Cash +'],
          negativeEffects: ['Tedium +'],
        },
      ],
    },
    classroom: {
      focus: 'TA work — paid by the hour',
      activities: [
        {
          label: 'Run a tutorial',
          category: 'teaching',
          cash: 110,
          effectHint: 'Paid teaching: cash plus teaching experience',
          positiveEffects: ['Cash +', 'Teaching +'],
          negativeEffects: ['Prep time −'],
        },
        {
          label: 'Mark coursework',
          category: 'teaching',
          cash: 70,
          effectHint: 'Paid marking: cash for red ink',
          flavour: 'Forty scripts, one rubric, and a slow erosion of faith in rubrics.',
          positiveEffects: ['Cash +', 'Teaching +'],
          negativeEffects: ['Mood −'],
        },
      ],
    },
    seminar_room: {
      focus: 'Attend talks',
      activities: [
        { label: 'Attend a talk', category: 'networking' },
        {
          label: 'Three-minute-thesis contest',
          category: 'networking',
          timeCost: 15,
          effectHint: 'High stakes: a name for yourself and £100, or public blankness',
          flavour: 'One slide, three minutes, every word a hostage.',
          positiveEffects: ['Maybe rep ++', 'Maybe £100'],
          negativeEffects: ['Stress risk'],
          gamble: {
            odds: 0.25,
            win: { reputation: 3, personal_funds: 100, mood: 3 },
            lose: { stress: 4 },
            winText: 'You win the three-minute thesis: clean, funny, devastating.',
            loseText: 'You blank at minute two. The silence has a postcode.',
          },
        },
      ],
    },
    conference_venue: {
      focus: 'Present your work — if you can pay the fee',
      activities: [
        {
          label: 'Register and present a poster',
          category: 'networking',
          timeCost: 25,
          cash: -150,
          effectHint: 'Costs real money; builds real visibility',
          flavour: 'Ninety seconds of glory per passer-by, plus a tube for the poster.',
          positiveEffects: ['Reputation +', 'Contacts +'],
          negativeEffects: ['Cash −', 'Stress +'],
        },
        {
          label: 'Lurk by the coffee, unregistered',
          category: 'networking',
          timeCost: 10,
          effectHint: 'Free networking of questionable legitimacy',
          flavour: 'The lanyard-free neck draws glances, but the coffee is undefended.',
          positiveEffects: ['Contacts +'],
          negativeEffects: ['Standing risk'],
        },
      ],
    },
    funder_portal: {
      focus: 'Small grants',
      personality: 'The portal applauds ambition, then asks for a cost code you do not have.',
      activities: [{ label: 'Apply for a small grant', category: 'funding' }],
    },
    cafe_pub: {
      focus: 'Peer support',
      activities: [
        { label: 'Peer support', category: 'networking', cash: -15 },
        { label: 'Unwind', category: 'personal', cash: -10 },
        PUB_QUIZ,
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
      activities: [
        {
          label: 'Give a guest lecture',
          category: 'teaching',
          cash: 130,
          effectHint: 'Paid teaching: cash plus teaching experience',
          positiveEffects: ['Cash +', 'Teaching +'],
          negativeEffects: ['Prep time −'],
        },
      ],
    },
    seminar_room: {
      focus: 'Present your work',
      activities: [
        { label: 'Present your work', category: 'networking' },
        { label: 'Committee work', category: 'service' },
      ],
    },
    conference_venue: {
      focus: 'Be seen — if you can pay the fee',
      activities: [
        {
          label: 'Register and give a talk',
          category: 'networking',
          timeCost: 25,
          cash: -180,
          effectHint: 'Costs real money; builds real visibility',
          flavour: 'Twelve minutes, three questions, one of which is a comment.',
          positiveEffects: ['Reputation +', 'Contacts +'],
          negativeEffects: ['Cash −', 'Stress +'],
        },
        {
          label: 'Lurk by the coffee, unregistered',
          category: 'networking',
          timeCost: 10,
          effectHint: 'Free networking of questionable legitimacy',
          positiveEffects: ['Contacts +'],
          negativeEffects: ['Standing risk'],
        },
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
        { label: 'Meet a collaborator', category: 'networking', cash: -15 },
        { label: 'Unwind', category: 'personal', cash: -10 },
        PUB_QUIZ,
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
        {
          label: 'Department politics',
          category: 'networking',
          cash: -20,
          flavour: 'Strategic rounds. The receipts are, in a sense, an investment portfolio.',
        },
        { label: 'Unwind', category: 'personal', cash: -10 },
        PUB_QUIZ,
      ],
    },
    conference_venue: {
      focus: 'Keynotes and visibility',
      activities: [
        {
          label: 'Register and give a talk',
          category: 'networking',
          timeCost: 25,
          cash: -220,
          effectHint: 'Costs real money; builds real visibility',
          positiveEffects: ['Reputation +', 'Contacts +'],
          negativeEffects: ['Cash −', 'Stress +'],
        },
        {
          label: 'Send your PhD student instead',
          category: 'service',
          timeCost: 10,
          cash: -120,
          effectHint: 'Pay their fee; bank the goodwill',
          flavour: 'They get the experience; you get the acknowledgement slide.',
          positiveEffects: ['Standing +', 'Karma +'],
          negativeEffects: ['Cash −'],
        },
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

// Stage-independent locations: recovery and its price. The gym and GP cost a
// little money; the parks are the free alternative — a deliberate budget choice.
const SHARED_BOARD: Partial<Record<LocationId, StageLocation>> = {
  gym_outdoors: {
    focus: 'Recover',
    activities: [
      {
        label: 'Train at the gym',
        category: 'personal',
        timeCost: 20,
        cash: -15,
        effectHint: 'Costs a little; repays sleep, health, and calm',
        positiveEffects: ['Health +', 'Stress −'],
        negativeEffects: ['Cash −'],
      },
      {
        label: 'Run in the fresh air',
        category: 'personal',
        timeCost: 15,
        effectHint: 'Free recovery, weather permitting',
        positiveEffects: ['Health +', 'Mood +'],
        negativeEffects: ['Time −'],
      },
    ],
  },
  health_centre: {
    focus: 'Look after yourself',
    activities: [
      {
        label: 'See the GP',
        category: 'personal',
        timeCost: 15,
        cash: -20,
        effectHint: 'Prescription charge; conditions improve with treatment',
        positiveEffects: ['Health +', 'Treatment'],
        negativeEffects: ['Cash −'],
      },
      {
        label: 'Book a therapy session',
        category: 'personal',
        timeCost: 20,
        cash: -35,
        effectHint: 'Costs money; pays it back in calm',
        flavour: 'Fifty minutes in which nobody asks about your publication pipeline.',
        positiveEffects: ['Stress −', 'Mood +'],
        negativeEffects: ['Cash −'],
      },
    ],
  },
  park_west: {
    focus: 'Clear your head',
    activities: [
      { label: 'Sit on a bench', category: 'personal', timeCost: 10, effectHint: 'Free calm, pigeon-adjacent' },
      { label: 'Feed the pigeons', category: 'personal', timeCost: 15, effectHint: 'Free calm; the committee approves' },
    ],
  },
  park_east: {
    focus: 'A quiet walk',
    activities: [
      { label: 'Walk the river path', category: 'personal', timeCost: 15, effectHint: 'Free calm beside the ducks' },
    ],
  },
};

function isRoutineBoardCategory(category: ActionCategory): category is RoutineBoardCategory {
  return category !== 'misconduct';
}

function defaultActivities(id: LocationId): Activity[] {
  return LOCATIONS[id].actions
    .filter(isRoutineBoardCategory)
    .map((category) => ({ label: DEFAULT_VERB[category], category }));
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function withActivityDefaults(activity: Activity, stage: Stage, location: LocationId, index: number): BoardActivity {
  return {
    ...activity,
    id: activity.id ?? `${stage}:${location}:${slug(activity.label)}:${activity.category}:${index}`,
    timeCost: activity.timeCost ?? DEFAULT_TIME_COST[activity.category],
    effectHint: activity.effectHint ?? DEFAULT_EFFECT_HINT[activity.category],
    flavour: activity.flavour ?? DEFAULT_FLAVOUR[activity.category],
    cash: activity.cash ?? 0,
    positiveEffects: activity.positiveEffects ?? DEFAULT_POSITIVE_EFFECTS[activity.category],
    negativeEffects: activity.negativeEffects ?? DEFAULT_NEGATIVE_EFFECTS[activity.category],
  };
}

export function activitiesAtStage(stage: Stage, id: LocationId): BoardActivity[] {
  const activities =
    STAGE_BOARD[stage]?.[id]?.activities ?? SHARED_BOARD[id]?.activities ?? defaultActivities(id);
  return activities.map((activity, index) => withActivityDefaults(activity, stage, id, index));
}

export function focusAtStage(stage: Stage, id: LocationId): string {
  return STAGE_BOARD[stage]?.[id]?.focus ?? SHARED_BOARD[id]?.focus ?? DEFAULT_FOCUS[id];
}

export function personalityAtStage(stage: Stage, id: LocationId): string {
  return (
    STAGE_BOARD[stage]?.[id]?.personality ?? SHARED_BOARD[id]?.personality ?? DEFAULT_PERSONALITY[id]
  );
}

export function actionsAtStage(stage: Stage, id: LocationId): ActionCategory[] {
  return [...new Set(activitiesAtStage(stage, id).map((a) => a.category))];
}
