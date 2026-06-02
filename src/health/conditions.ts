// Health conditions (specification §4.7).
//
// Conditions have a type, severity, onset turn, status, and a productivity
// penalty. Severe conditions reduce effective productivity, and untreated
// conditions can become chronic. Treatments (`041`) and the CV costs list
// (`061`) are handled elsewhere. All functions return new values; inputs are
// not mutated.

export type ConditionType =
  | 'burnout'
  | 'anxiety'
  | 'depression'
  | 'insomnia'
  | 'physical_injury';

export type Severity = 'mild' | 'moderate' | 'severe';

export type ConditionStatus = 'active' | 'in_treatment' | 'recovered' | 'chronic';

export type TreatmentType =
  | 'none'
  | 'gp'
  | 'therapy'
  | 'medication'
  | 'reduced_workload'
  | 'sick_leave';

export interface HealthCondition {
  condition_id: string;
  type: ConditionType;
  severity: Severity;
  onset_turn: number;
  status: ConditionStatus;
  treatment_in_progress: TreatmentType;
  productivity_penalty: number; // 0..1
}

export const SEVERITY_PENALTY: Record<Severity, number> = {
  mild: 0.05,
  moderate: 0.15,
  severe: 0.3,
};

// Turns an untreated condition can persist before becoming chronic.
export const CHRONIC_THRESHOLD_TURNS = 4;

export function createCondition(
  conditionId: string,
  type: ConditionType,
  severity: Severity,
  onsetTurn: number,
): HealthCondition {
  return {
    condition_id: conditionId,
    type,
    severity,
    onset_turn: onsetTurn,
    status: 'active',
    treatment_in_progress: 'none',
    productivity_penalty: SEVERITY_PENALTY[severity],
  };
}

// The productivity penalty a condition currently imposes (recovered → none).
export function effectivePenalty(condition: HealthCondition): number {
  return condition.status === 'recovered' ? 0 : condition.productivity_penalty;
}

// Combined penalty across all conditions, capped at a total loss of 1.
export function totalProductivityPenalty(conditions: HealthCondition[]): number {
  const sum = conditions.reduce((total, c) => total + effectivePenalty(c), 0);
  return Math.min(1, sum);
}

// Progress a condition one turn: an untreated condition that has persisted long
// enough becomes chronic.
export function progressCondition(
  condition: HealthCondition,
  currentTurn: number,
): HealthCondition {
  if (condition.status === 'recovered' || condition.status === 'chronic') return condition;
  const untreated = condition.treatment_in_progress === 'none';
  if (untreated && currentTurn - condition.onset_turn >= CHRONIC_THRESHOLD_TURNS) {
    return { ...condition, status: 'chronic' };
  }
  return condition;
}
