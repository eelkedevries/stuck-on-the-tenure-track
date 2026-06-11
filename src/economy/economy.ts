// Term finances (specification §2 calendar-conditional salary/stipend events,
// §4.1 funds).
//
// Money is the board's pressure loop: each term some income lands (loan,
// stipend, salary — by career stage) and the rent goes out. Paid work on the
// board tops cash up mid-term; cafés, gyms, conferences and prescriptions
// drain it. Going overdrawn at term end costs wellbeing, so the player has a
// Jones-style juggle: earn enough to stay afloat without burning the time the
// career actually needs. Personal funds only; research funds stay grant-bound.

import type { SaveGame } from '../state/save';
import type { Stage } from '../calendar/stages';

interface StageFinances {
  income: number;
  incomeLabel: string;
  rent: number;
  rentLabel: string;
}

// Per-term amounts, tuned so the stipend barely clears the rent: anything the
// player wants beyond survival — pints, gym, conference fees — has to be
// earned on the board. Seniority slowly loosens the squeeze, the classic
// rags-to-tenure arc.
export const STAGE_FINANCES: Record<Stage, StageFinances> = {
  undergraduate: {
    income: 900,
    incomeLabel: 'Maintenance loan instalment',
    rent: 850,
    rentLabel: 'Halls rent',
  },
  msc: {
    income: 1000,
    incomeLabel: 'Loan plus demonstrating pay',
    rent: 950,
    rentLabel: 'House-share rent',
  },
  phd: {
    income: 1500,
    incomeLabel: 'PhD stipend',
    rent: 1300,
    rentLabel: 'House-share rent',
  },
  postdoc: {
    income: 2400,
    incomeLabel: 'University payroll',
    rent: 1900,
    rentLabel: 'Flat rent',
  },
  assistant_professor: {
    income: 3000,
    incomeLabel: 'University payroll',
    rent: 2300,
    rentLabel: 'Flat rent',
  },
};

// Overdraft pain at term end: the bank writes, sleep does not improve.
const OVERDRAWN_STRESS = 12;
const OVERDRAWN_MOOD = 8;

export function formatMoney(amount: number): string {
  const abs = Math.abs(Math.round(amount));
  const grouped = abs.toLocaleString('en-GB');
  return `${amount < 0 ? '−' : ''}£${grouped}`;
}

export interface TermFinanceResult {
  state: SaveGame;
  lines: string[];
  overdrawn: boolean;
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

// Apply the term's income and rent at term end. Returns diary lines so the
// recap can report the money story alongside the career one.
export function applyTermFinances(state: SaveGame, stage: Stage): TermFinanceResult {
  const fin = STAGE_FINANCES[stage];
  const before = state.player.funds.personal;
  const after = before + fin.income - fin.rent;

  const lines: string[] = [
    `Money: ${fin.incomeLabel} +${formatMoney(fin.income)}; ${fin.rentLabel.toLowerCase()} −${formatMoney(fin.rent)}. Balance ${formatMoney(after)}.`,
  ];

  const overdrawn = after < 0;
  let wellbeing = state.player.wellbeing;
  if (overdrawn) {
    wellbeing = {
      ...wellbeing,
      stress: clamp(wellbeing.stress + OVERDRAWN_STRESS),
      mood: clamp(wellbeing.mood - OVERDRAWN_MOOD),
    };
    lines.push(
      'The account is overdrawn. The bank has written to you in the tone of a disappointed supervisor.',
    );
  }

  return {
    state: {
      ...state,
      player: {
        ...state.player,
        funds: { ...state.player.funds, personal: after },
        wellbeing,
      },
    },
    lines,
    overdrawn,
  };
}
