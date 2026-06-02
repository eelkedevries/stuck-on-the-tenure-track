// Treatment actions (specification §4.7).
//
// GP visit, therapy, medication, reduced workload, and sick leave each ease a
// condition: severity steps down, the penalty is recalculated, and the status
// reflects treatment or recovery. Chronic conditions can be managed (severity
// eased) but not cured. The imposter subsystem (`042`) and CV costs list (`061`)
// are handled elsewhere. Functions return a new condition; inputs are not
// mutated.

import type { HealthCondition, Severity, TreatmentType } from './conditions';
import { SEVERITY_PENALTY } from './conditions';

export const TREATMENTS: readonly TreatmentType[] = [
  'gp',
  'therapy',
  'medication',
  'reduced_workload',
  'sick_leave',
];

const SEVERITY_ORDER: readonly Severity[] = ['mild', 'moderate', 'severe'];

function easeSeverity(severity: Severity): Severity {
  const index = SEVERITY_ORDER.indexOf(severity);
  return SEVERITY_ORDER[Math.max(0, index - 1)];
}

// Apply a treatment to a condition. Eases severity by one step and records the
// treatment in progress. A non-chronic mild condition resolves to recovered;
// chronic conditions stay chronic but with a reduced penalty.
export function applyTreatment(
  condition: HealthCondition,
  treatment: TreatmentType,
): HealthCondition {
  if (treatment === 'none' || condition.status === 'recovered') return condition;

  const recovered = condition.severity === 'mild' && condition.status !== 'chronic';
  const newSeverity = easeSeverity(condition.severity);

  return {
    ...condition,
    severity: newSeverity,
    treatment_in_progress: treatment,
    status: recovered ? 'recovered' : condition.status === 'chronic' ? 'chronic' : 'in_treatment',
    productivity_penalty: recovered ? 0 : SEVERITY_PENALTY[newSeverity],
  };
}
