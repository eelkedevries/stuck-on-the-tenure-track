// Location characters (specification §5 tone; board personality layer).
//
// Every location has a resident character in the Jones-in-the-Fast-Lane mould:
// a named face behind the counter with a rotating line of patter. Lines are
// cosmetic — they change nothing mechanically — but they make each visit feel
// like walking into a place rather than opening a menu. Rotation is
// deterministic in the turn and visit count, so revisiting mid-term gives the
// next line rather than a dice roll.

import type { LocationId } from '../locations/types';

export interface LocationNpc {
  name: string;
  role: string;
  sprite: string;
  lines: string[];
}

export const NPCS: Record<LocationId, LocationNpc> = {
  home: {
    name: 'Mrs Boekema',
    role: 'Landlady',
    sprite: 'npc-landlady',
    lines: [
      'Rent leaves your account at the end of term, dear. The boiler and I make no further promises.',
      'You look tired. I had a tenant like you once. He became a dentist. Lovely car.',
      'I heard pacing at 3 a.m. Studying, or regret? Either way, mind the floorboards.',
      'A parcel came for you. I have taken the liberty of judging its weight.',
    ],
  },
  upscale_home: {
    name: 'Casper',
    role: 'Concierge',
    sprite: 'npc-concierge',
    lines: [
      'Welcome home. The lift works and nobody here knows what an h-index is. Bliss.',
      'Your post is mostly journals you no longer have time to read. Shall I recycle the guilt?',
      'A quiet evening in, perhaps? The building approves of rest. It is in the lease.',
      'The neighbours believe you do something with computers. I have not corrected them.',
    ],
  },
  office: {
    name: 'Prof. Duif',
    role: 'Head of department',
    sprite: 'npc-chair',
    lines: [
      'Ah, you. Excellent. There is a small form. There is always a small form.',
      'Publish, my friend. The committee reads CVs the way gulls read chips.',
      'My door is always open. Metaphorically. Literally it is locked; email my assistant.',
      'When I was your age, tenure was simpler. We simply waited for someone to die.',
    ],
  },
  lab: {
    name: 'Tessa',
    role: 'Lab technician',
    sprite: 'npc-tech',
    lines: [
      'Touch nothing on the left bench. The right bench is fine. The left bench remembers.',
      'Your participants cancelled twice. I rebooked them and judged them silently.',
      'The centrifuge is fixed. The cause was, and I quote the engineer, "enthusiasm".',
      'Label your samples. The freezer is not a lottery, although it behaves like one.',
    ],
  },
  library: {
    name: 'Mags',
    role: 'Librarian',
    sprite: 'npc-librarian',
    lines: [
      'Sssh. Not you — the undergraduates. You may sigh quietly at the literature.',
      'That book you need is available. In one library. In Ottawa.',
      'I renewed your loans. One of them is overdue from before your degree began.',
      'The paywall is down today, which is the closest this place gets to a festival.',
    ],
  },
  classroom: {
    name: 'Jay',
    role: 'Student rep',
    sprite: 'npc-student',
    lines: [
      'Quick one — will this be on the exam? Asking for all of us, forever.',
      'The cohort says your slides are "actually fine", which is the highest known rating.',
      'Half the class watched the recording at double speed. You sound very dynamic.',
      'Feedback forms are in. Someone wrote "more memes". Someone else wrote "fewer memes".',
    ],
  },
  seminar_room: {
    name: 'Prof. Aalders',
    role: 'Emeritus',
    sprite: 'npc-emeritus',
    lines: [
      'Less a question, more a comment — in fact, more a memoir. Settle in.',
      'Interesting talk. I did something similar in 1987. Better, arguably. Biscuit?',
      'The seminar starts when the projector surrenders. It knows the drill.',
      'Sit anywhere. The third row is mine. It has been mine since the Cold War.',
    ],
  },
  cafe_pub: {
    name: 'Bram',
    role: 'Barista-landlord',
    sprite: 'npc-barista',
    lines: [
      'The usual? One oat flat white and a chat about someone’s grant, coming up.',
      'Shift work pays cash in hand. Academia could learn a lot from this establishment.',
      'I hear everything in here. For a coffee, I forget most of it.',
      'You lot talk about "impact" a lot for people who whisper in cafés.',
    ],
  },
  conference_venue: {
    name: 'Lotte',
    role: 'Registration desk',
    sprite: 'npc-rep',
    lines: [
      'Badge, lanyard, tote bag. The tote bag is mandatory. The science is optional.',
      'The keynote is full. The overflow room has a screen and better seats. Everyone knows.',
      'Networking drinks at six. The wine is bad; the alliances are worse. Enjoy!',
      'Your talk is opposite the free lunch. I am so sorry. We are all so sorry.',
    ],
  },
  funder_portal: {
    name: 'PORTAL-9',
    role: 'Submission system',
    sprite: 'npc-robot',
    lines: [
      'WELCOME, APPLICANT. YOUR OPTIMISM HAS BEEN LOGGED FOR QUALITY PURPOSES.',
      'ERROR 412: ATTACHMENT MUST BE FINAL AND ALSO RESUBMITTED. THIS IS NOT A CONTRADICTION.',
      'YOUR PROPOSAL IS ONE OF MANY EXCELLENT PROPOSALS. STATISTICALLY, CONDOLENCES.',
      'SESSION EXPIRES IN 4:59. THE PORTAL BELIEVES IN YOU. THE PORTAL BELIEVES IN NOTHING.',
    ],
  },
  gym_outdoors: {
    name: 'Coach Vik',
    role: 'Trainer',
    sprite: 'npc-coach',
    lines: [
      'Your body is the lab. The lab has been filing complaints. Let’s answer them.',
      'Twenty minutes here beats two hours of staring at a cursor. Peer-reviewed by me.',
      'Membership’s cheap. Cheaper than the physio you’ll need if you keep sitting like that.',
      'Stress lives in the shoulders. Yours have a full professorship.',
    ],
  },
  health_centre: {
    name: 'Dr Salam',
    role: 'GP',
    sprite: 'npc-gp',
    lines: [
      'Sleep, food, daylight. I can prescribe the rest, but those three are on you.',
      'On a scale of one to ten, how bad is it? Academics always say four. It is never four.',
      'I see a lot of your colleagues. You are all very resilient, which worries me deeply.',
      'Take the full course. Of rest, I mean. The tablets come with instructions; rest does not.',
    ],
  },
  park_west: {
    name: 'The pigeons',
    role: 'Local committee',
    sprite: 'npc-pigeon',
    lines: [
      'The pigeons convene, conclude you have no chips, and withdraw their attention entirely.',
      'A pigeon regards you without judgement. It has never heard of Reviewer 2.',
      'The committee of pigeons approves your bench application. No corrections.',
      'One pigeon struts in circles. You recognise the methodology.',
    ],
  },
  park_east: {
    name: 'The duck',
    role: 'River resident',
    sprite: 'npc-duck',
    lines: [
      'The duck has no feedback for you. It is the healthiest relationship you have.',
      'The duck glides by, unburdened by metrics. Show-off.',
      'You explain your career plan to the duck. The duck leaves. Fair.',
      'The river keeps moving without writing anything down. There is a lesson in it.',
    ],
  },
};

// The next line of patter for a location, rotating with the turn and the
// number of times the player has dropped by.
export function npcLine(location: LocationId, turn: number, visit: number): string {
  const npc = NPCS[location];
  const lines = npc.lines;
  return lines[(turn + visit) % lines.length];
}
