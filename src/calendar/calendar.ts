// Calendar model (specification §3).
//
// The engine maintains a current date, a turn number, and the start date, all
// as ISO dates (YYYY-MM-DD). Date arithmetic is done in UTC to avoid timezone
// drift. Stage-specific turn durations are layered on top of this by `022`.

import type { Calendar } from '../state/save';

function toUtc(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  const date = toUtc(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return toIso(date);
}

export function addMonths(iso: string, months: number): string {
  const date = toUtc(iso);
  date.setUTCMonth(date.getUTCMonth() + months);
  return toIso(date);
}

// Create a calendar starting at the given ISO date, before any turn has run.
export function createCalendar(startDate: string): Calendar {
  return { current_date: startDate, turn_number: 0, start_date: startDate };
}

// Advance the calendar by a number of months and/or days, incrementing the
// turn number. Returns a new calendar; the input is not mutated.
export function advanceCalendar(
  calendar: Calendar,
  by: { months?: number; days?: number },
): Calendar {
  let current = calendar.current_date;
  if (by.months) current = addMonths(current, by.months);
  if (by.days) current = addDays(current, by.days);
  return {
    current_date: current,
    turn_number: calendar.turn_number + 1,
    start_date: calendar.start_date,
  };
}
