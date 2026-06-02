// Grant success model (specification §4.4).
//
// Success probability combines the call's base success rate with the
// applicant's writing and politics expertise, time invested, prior grants, and
// publication record, plus luck at the point of resolution. A logistic function
// keeps the probability in (0, 1) and monotonically increasing in each
// positively-weighted factor.

export interface GrantApplicationFactors {
  baseRate: number; // the call's typical success rate, 0..1
  writing: number; // writing expertise
  politics: number; // politics expertise
  timeInvested: number; // time points allocated to the application, 0..100
  priorGrants: number; // number of grants previously won
  publicationRecord: number; // a record strength, e.g. weighted publications or h-index
}

const WEIGHTS = {
  writing: 0.04,
  politics: 0.03,
  time: 0.02,
  priorGrants: 0.15,
  record: 0.05,
};

function logistic(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function logit(p: number): number {
  const clamped = Math.min(Math.max(p, 1e-6), 1 - 1e-6);
  return Math.log(clamped / (1 - clamped));
}

// Probability of success in (0, 1). The base rate sets the offset; each factor
// shifts the log-odds upward.
export function successProbability(factors: GrantApplicationFactors): number {
  const z =
    logit(factors.baseRate) +
    WEIGHTS.writing * factors.writing +
    WEIGHTS.politics * factors.politics +
    WEIGHTS.time * (factors.timeInvested / 10) +
    WEIGHTS.priorGrants * factors.priorGrants +
    WEIGHTS.record * factors.publicationRecord;
  return logistic(z);
}

export interface GrantOutcome {
  probability: number;
  success: boolean;
}

// Resolve an application. Luck is the random draw; inject `rng` for determinism.
export function resolveApplication(
  factors: GrantApplicationFactors,
  rng: () => number = Math.random,
): GrantOutcome {
  const probability = successProbability(factors);
  return { probability, success: rng() < probability };
}
