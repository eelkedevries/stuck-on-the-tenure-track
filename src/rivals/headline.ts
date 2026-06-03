// Compact public rival headlines for the main turn screen (specification §4.9,
// §4.11). Headlines are derived from CohortEntry, the same public projection
// used by the detailed cohort tracker, so private wellbeing and misconduct
// fields cannot leak into the main screen.

import type { CohortEntry } from './cohort';

type PublicHeadlineFact = {
  rival_id: string;
  score: number;
  text: string;
};

// Pick one dry, specific public update. The turn number rotates ties and
// near-ties so the visible rival presence changes without adding mechanics.
export function rivalHeadline(entries: CohortEntry[], turnNumber = 0): string | null {
  if (entries.length === 0) return null;

  const facts: PublicHeadlineFact[] = entries.flatMap((entry) => {
    const recent = entry.recent_event
      ? [
          {
            rival_id: entry.rival_id,
            score: 40 + entry.publications + entry.h_index,
            text: `${entry.name}: ${entry.recent_event}.`,
          },
        ]
      : [];

    return [
      ...recent,
      {
        rival_id: entry.rival_id,
        score: 30 + entry.h_index * 3,
        text: `${entry.name}'s h-index is now ${entry.h_index}.`,
      },
      {
        rival_id: entry.rival_id,
        score: 20 + entry.publications * 2,
        text: `${entry.name} lists ${entry.publications} publications.`,
      },
      {
        rival_id: entry.rival_id,
        score: 10 + entry.affiliation_prestige,
        text: `${entry.name}'s institution prestige is ${entry.affiliation_prestige}.`,
      },
    ];
  });

  const ordered = facts.sort((a, b) => {
    const scoreDelta = b.score - a.score;
    if (scoreDelta !== 0) return scoreDelta;
    return a.rival_id.localeCompare(b.rival_id);
  });
  const window = ordered.slice(0, Math.min(ordered.length, Math.max(1, entries.length)));
  const pick = Math.abs(turnNumber) % window.length;

  return `Cohort bulletin: ${window[pick].text}`;
}
