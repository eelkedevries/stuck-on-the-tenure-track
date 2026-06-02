// Time points and action categories (specification §4.2).
//
// Each turn has a fixed budget of time points the player allocates across
// action categories, then commits. Outcome resolution is handled separately
// (`025`); binding actions to locations is handled by `050`.

export const TURN_TIME_POINTS = 100;

export type ActionCategory =
  | 'research'
  | 'teaching'
  | 'service'
  | 'networking'
  | 'funding'
  | 'personal'
  | 'misconduct';

export const ACTION_CATEGORIES: readonly ActionCategory[] = [
  'research',
  'teaching',
  'service',
  'networking',
  'funding',
  'personal',
  'misconduct',
];

export type Allocation = Record<ActionCategory, number>;

export function emptyAllocation(): Allocation {
  return {
    research: 0,
    teaching: 0,
    service: 0,
    networking: 0,
    funding: 0,
    personal: 0,
    misconduct: 0,
  };
}

export function allocationTotal(allocation: Allocation): number {
  return ACTION_CATEGORIES.reduce((sum, category) => sum + allocation[category], 0);
}

export function remainingPoints(allocation: Allocation): number {
  return TURN_TIME_POINTS - allocationTotal(allocation);
}

// Set the points for one category. Rejects negatives and any allocation that
// would push the turn total beyond the budget. Returns a new allocation.
export function allocate(
  allocation: Allocation,
  category: ActionCategory,
  points: number,
): Allocation {
  if (!Number.isInteger(points) || points < 0) {
    throw new RangeError(`Points must be a non-negative integer, got ${points}.`);
  }
  const next = { ...allocation, [category]: points };
  if (allocationTotal(next) > TURN_TIME_POINTS) {
    throw new RangeError(
      `Allocation of ${allocationTotal(next)} exceeds the ${TURN_TIME_POINTS}-point budget.`,
    );
  }
  return next;
}

export interface CommittedAllocation {
  allocation: Allocation;
  total: number;
}

// Commit an allocation for the turn. Throws if it exceeds the budget.
export function commit(allocation: Allocation): CommittedAllocation {
  const total = allocationTotal(allocation);
  if (total > TURN_TIME_POINTS) {
    throw new RangeError(`Cannot commit ${total} points; budget is ${TURN_TIME_POINTS}.`);
  }
  return { allocation: { ...allocation }, total };
}
