// Performance-budget measurement (specification §5; roadmap M16, prompt 071).
//
// Verifies two of the binding budgets directly and measurably:
//   1. Production bundle size  < 5 MB
//   2. Turn resolution (incl. rivals) < 1 s
//
// Time-to-interactive (< 3 s on a mid-range smartphone over 4G) is a field
// metric that cannot be measured in CI; it is bounded here indirectly by the
// bundle-size budget, since a tens-of-kilobytes static bundle loads well within
// 3 s over 4G. The turn-resolution path is exercised through Vite's SSR module
// loader so the *real* engine code is measured, not a re-implementation.

import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createServer } from 'vite';

const BUNDLE_BUDGET_BYTES = 5 * 1024 * 1024; // 5 MB
const TURN_BUDGET_MS = 1000; // 1 s
const DIST_DIR = 'dist';

let failed = false;

function dirSize(dir) {
  let total = 0;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const info = statSync(full);
    total += info.isDirectory() ? dirSize(full) : info.size;
  }
  return total;
}

// --- 1. Bundle size -------------------------------------------------------
if (!existsSync(DIST_DIR)) {
  console.error(`No build found at ${DIST_DIR}/. Run "npm run build" first.`);
  process.exit(1);
}
const bundleBytes = dirSize(DIST_DIR);
const bundleMB = (bundleBytes / (1024 * 1024)).toFixed(3);
const bundleOk = bundleBytes < BUNDLE_BUDGET_BYTES;
console.log(
  `Bundle size: ${bundleBytes} bytes (${bundleMB} MB) — budget 5 MB — ${bundleOk ? 'PASS' : 'FAIL'}`,
);
if (!bundleOk) failed = true;

// --- 2. Turn resolution ---------------------------------------------------
const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const { runTurn } = await vite.ssrLoadModule('/src/engine/turn.ts');
  const { emptyAllocation } = await vite.ssrLoadModule('/src/engine/actions.ts');

  // A representative late-career allocation (sums to the 100-point budget).
  const allocation = {
    ...emptyAllocation(),
    research: 40,
    teaching: 20,
    service: 10,
    networking: 10,
    funding: 10,
    personal: 10,
  };

  const state = {
    save_version: 1,
    game_seed: 'perf-bench',
    created_at: '2026-09-01T00:00:00.000Z',
    last_played_at: '2026-09-01T00:00:00.000Z',
    calendar: { current_date: '2026-09-01', turn_number: 10, start_date: '2020-09-01' },
    settings: { spelling: 'en-GB', light_narrative_mode: false },
    player: {
      name: 'Bench',
      gender: 'unspecified',
      broad_discipline: 'psychology',
      funds: { personal: 1000, research: 5000 },
      wellbeing: { sleep: 60, mood: 60, physical: 60 },
      expertise: { methods: 30, theory: 25, writing: 20, statistics: 25, teaching: 15, politics: 10 },
      standing: { rank: 'assistant_professor', reputation: 40, affiliation_prestige: 50 },
      specialisation: { status: 'committed', current_sub_discipline: 'cognitive', commitment_turn: 6 },
      imposter_state: { perceived_competence: 40, actual_competence: 55 },
      health_conditions: [],
      papers: [],
      grants_held: [],
      grants_applied: [],
      relationships: [],
      milestones_completed: [],
    },
    rivals: [],
    events_history: [],
  };

  const archetypes = ['grinder', 'networker', 'gambler'];
  const rivals = archetypes.map((archetype, i) => ({
    rival_id: `r${i}`,
    name: `Rival ${i}`,
    archetype,
    rank: 'assistant_professor',
    publications: 12,
    h_index: 6,
    affiliation_prestige: 50,
    recent_event: null,
    wellbeing: 50,
    committed_misconduct: false,
  }));

  // Deterministic RNG so the measurement is repeatable.
  let seed = 1;
  const rng = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  const deps = { allocation, storage: null, rivals, rng };

  // Warm up (let the JIT settle), then measure a worst-of run over many turns.
  for (let i = 0; i < 200; i += 1) runTurn(state, 'assistant_professor', deps);

  const N = 5000;
  let worst = 0;
  const start = performance.now();
  for (let i = 0; i < N; i += 1) {
    const t0 = performance.now();
    runTurn(state, 'assistant_professor', deps);
    worst = Math.max(worst, performance.now() - t0);
  }
  const total = performance.now() - start;
  const mean = total / N;

  const turnOk = worst < TURN_BUDGET_MS;
  console.log(
    `Turn resolution over ${N} turns (3 rivals): mean ${mean.toFixed(4)} ms, ` +
      `worst ${worst.toFixed(4)} ms — budget 1000 ms — ${turnOk ? 'PASS' : 'FAIL'}`,
  );
  if (!turnOk) failed = true;
} finally {
  await vite.close();
}

if (failed) {
  console.error('Performance budget exceeded.');
  process.exit(1);
}
console.log('All measured performance budgets met.');
