// Deadline scheduling and resolution (specification §4.11a; prompt 080).
//
// `scheduleDeadlines` keeps a small rolling set of upcoming deadlines seeded
// from calendar-bound systems (an annual grant call, milestone reviews, and
// teaching prep). `advanceDeadlines` resolves them each turn: a deadline is met
// when the player did the relevant work, otherwise it is missed once overdue,
// with a consequence that feeds an existing system — never an immediate
// game-over. Returns new state; inputs are not mutated.

import type { SaveGame } from '../state/save';
import type { Allocation } from '../engine/actions';
import type { Deadline, Urgency } from './types';
import { addMonths } from '../calendar/calendar';
import { stageForTurn, type Stage } from '../calendar/stages';
import {
  passProbability,
  recordMilestone,
  applyMilestoneFailure,
  type MilestoneId,
} from '../milestones/milestones';

const DUE_NOW_DAYS = 90;
const SOON_DAYS = 270;
// Modest, to keep missed deadlines a pressure rather than a constant crisis.
const GRANT_MISS_PENALTY = 1;
const TEACHING_MISS_PENALTY = 2;

function daysBetween(fromISO: string, toISO: string): number {
  const ms = Date.parse(`${toISO}T00:00:00Z`) - Date.parse(`${fromISO}T00:00:00Z`);
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

export function urgencyFor(deadline: Deadline, currentDate: string): Urgency {
  const days = daysBetween(currentDate, deadline.due_date);
  if (days < 0) return 'overdue';
  if (days <= DUE_NOW_DAYS) return 'due_now';
  if (days <= SOON_DAYS) return 'soon';
  return 'later';
}

function deadlinesOf(state: SaveGame): Deadline[] {
  return (state.deadlines ?? []) as unknown as Deadline[];
}

function milestoneForStage(stage: Stage): MilestoneId | null {
  switch (stage) {
    case 'msc':
      return 'msc_defence';
    case 'phd':
      return 'phd_defence';
    case 'postdoc':
      return 'assistant_professor';
    case 'assistant_professor':
      return 'tenure_decision';
    default:
      return null;
  }
}

const MILESTONE_TITLE: Record<MilestoneId, string> = {
  bachelor_diploma: "Bachelor's diploma review",
  msc_defence: "Master's thesis defence",
  phd_defence: 'PhD dissertation defence',
  assistant_professor: 'Assistant-professor application',
  tenure_decision: 'Tenure review',
};

// Ensure upcoming deadlines exist, one pending per kind at a time.
export function scheduleDeadlines(state: SaveGame): SaveGame {
  const current = state.calendar.current_date;
  const turn = state.calendar.turn_number;
  const stage = stageForTurn(turn);
  const deadlines = deadlinesOf(state);
  const pendingTypes = new Set(
    deadlines.filter((d) => d.status === 'pending').map((d) => d.type),
  );
  const additions: Deadline[] = [];

  // Grant calls matter once you are expected to bring in money.
  if ((stage === 'postdoc' || stage === 'assistant_professor') && !pendingTypes.has('grant_call')) {
    additions.push({
      deadline_id: `grant-call-t${turn}`,
      type: 'grant_call',
      title: 'Annual grant call closes',
      due_date: addMonths(current, 12),
      status: 'pending',
    });
  }

  // Teaching prep is a recurring pressure once you convene modules.
  if (stage === 'assistant_professor' && !pendingTypes.has('teaching_prep')) {
    additions.push({
      deadline_id: `teaching-t${turn}`,
      type: 'teaching_prep',
      title: 'Teaching prep due',
      due_date: addMonths(current, 6),
      status: 'pending',
    });
  }

  const milestone = milestoneForStage(stage);
  if (
    milestone &&
    !state.player.milestones_completed.includes(milestone) &&
    !pendingTypes.has('milestone')
  ) {
    additions.push({
      deadline_id: `ms-${milestone}-t${turn}`,
      type: 'milestone',
      title: MILESTONE_TITLE[milestone],
      due_date: addMonths(current, 12),
      status: 'pending',
      milestone,
    });
  }

  if (additions.length === 0) return state;
  return {
    ...state,
    deadlines: [...deadlines, ...additions] as unknown as SaveGame['deadlines'],
  };
}

function reputationHit(state: SaveGame, amount: number): SaveGame {
  return {
    ...state,
    player: {
      ...state.player,
      standing: {
        ...state.player.standing,
        reputation: Math.max(0, state.player.standing.reputation - amount),
      },
    },
  };
}

// Resolve deadlines for the turn just committed, using the player's allocation
// to decide which were met. Missed deadlines apply a consequence.
export function advanceDeadlines(state: SaveGame, allocation: Allocation): SaveGame {
  const current = state.calendar.current_date;
  let s = state;
  const updated = deadlinesOf(state).map((d) => {
    if (d.status !== 'pending') return d;

    // Met when the relevant work was done this turn.
    if (d.type === 'grant_call' && allocation.funding >= 20) return { ...d, status: 'met' as const };
    if (d.type === 'teaching_prep' && allocation.teaching >= 20) {
      return { ...d, status: 'met' as const };
    }

    // Otherwise, miss it once overdue, with a consequence.
    if (d.due_date < current) {
      if (d.type === 'milestone' && d.milestone) {
        if (passProbability(s, d.milestone) >= 0.5) {
          s = recordMilestone(s, d.milestone);
          return { ...d, status: 'met' as const };
        }
        s = applyMilestoneFailure(s);
        return { ...d, status: 'missed' as const };
      }
      s = reputationHit(s, d.type === 'teaching_prep' ? TEACHING_MISS_PENALTY : GRANT_MISS_PENALTY);
      return { ...d, status: 'missed' as const };
    }

    return d;
  });

  return { ...s, deadlines: updated as unknown as SaveGame['deadlines'] };
}
