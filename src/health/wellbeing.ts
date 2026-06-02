// Coupled wellbeing (specification §4.7).
//
// Sleep, mood, and physical health update each turn and influence one another:
// sleep debt drags down mood and physical health, good sleep lifts them, and
// poor physical health depresses mood. Conditions (`040`) and the imposter
// subsystem (`042`) are handled separately. All values are clamped to 0..100.

import type { Wellbeing } from '../state/types';

export const WELLBEING_MIN = 0;
export const WELLBEING_MAX = 100;

function clamp(value: number): number {
  return Math.max(WELLBEING_MIN, Math.min(WELLBEING_MAX, value));
}

export interface WellbeingDeltas {
  sleep?: number;
  mood?: number;
  physical?: number;
}

// Apply the coupling between the three values for one turn.
export function coupleWellbeing(wellbeing: Wellbeing): Wellbeing {
  let { sleep, mood, physical } = wellbeing;
  if (sleep < 40) {
    mood -= 5;
    physical -= 3;
  } else if (sleep > 70) {
    mood += 2;
    physical += 1;
  }
  if (physical < 30) {
    mood -= 3;
  }
  return { sleep: clamp(sleep), mood: clamp(mood), physical: clamp(physical) };
}

// Advance wellbeing one turn: apply explicit deltas (from actions/events), then
// the coupling. Returns a new object; the input is not mutated.
export function stepWellbeing(wellbeing: Wellbeing, deltas: WellbeingDeltas = {}): Wellbeing {
  const applied: Wellbeing = {
    sleep: clamp(wellbeing.sleep + (deltas.sleep ?? 0)),
    mood: clamp(wellbeing.mood + (deltas.mood ?? 0)),
    physical: clamp(wellbeing.physical + (deltas.physical ?? 0)),
  };
  return coupleWellbeing(applied);
}
