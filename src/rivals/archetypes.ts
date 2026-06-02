// Rival archetypes (specification §4.9).
//
// Three computer rivals from the player's cohort are scripted stochastic
// archetypes — never runtime LLMs (specification §9). This module defines the
// four archetypes and their behavioural parameters; parallel simulation (`046`)
// and the public cohort tracker (`047`) are implemented separately.

export type RivalArchetype = 'grinder' | 'networker' | 'gambler' | 'genuine_scholar';

export const RIVAL_ARCHETYPES: readonly RivalArchetype[] = [
  'grinder',
  'networker',
  'gambler',
  'genuine_scholar',
];

export interface RivalProfile {
  // Mean papers produced per turn.
  outputRate: number;
  // Mean citation quality per paper (tier pull; higher = better venues).
  quality: number;
  // Prestige/visibility gained per turn through networking.
  networking: number;
  // Tendency to take risks (gambles, grey practices), 0..1.
  riskTaking: number;
  // Output variance multiplier; higher = swingier results.
  variance: number;
}

export const RIVAL_PROFILES: Record<RivalArchetype, RivalProfile> = {
  // Steady, high-volume output; modest venues; low risk; very consistent.
  grinder: { outputRate: 2.2, quality: 1.0, networking: 0.5, riskTaking: 0.1, variance: 0.3 },
  // Moderate output; thrives on connections and prestige; low-medium risk.
  networker: { outputRate: 1.3, quality: 1.2, networking: 2.0, riskTaking: 0.3, variance: 0.6 },
  // Boom-or-bust: high variance, high risk, occasional big hits.
  gambler: { outputRate: 1.5, quality: 1.6, networking: 1.0, riskTaking: 0.7, variance: 1.5 },
  // Lower volume, high quality, low risk, steady.
  genuine_scholar: { outputRate: 1.0, quality: 2.2, networking: 0.8, riskTaking: 0.05, variance: 0.4 },
};

export function rivalProfile(archetype: RivalArchetype): RivalProfile {
  return RIVAL_PROFILES[archetype];
}
