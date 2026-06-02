# Performance budgets

Specification §5 sets three performance budgets for the beta. This note records
how each is measured and the most recent measured result. Run `npm run perf` to
reproduce (it builds, checks the bundle size, and benchmarks turn resolution
through the real engine via Vite's SSR module loader).

## Budgets and results

| Budget | Target | Measured | How measured |
| --- | --- | --- | --- |
| Production bundle | < 5 MB | ~0.05 MB | `dist/` total size after `vite build` |
| Turn resolution (incl. rivals) | < 1 s | mean ~0.01 ms, worst ~1.1 ms over 5000 turns | `scripts/measure-perf.mjs` runs the real `runTurn` with three rivals |
| Time to interactive (mid-range smartphone, 4G) | < 3 s | not directly measurable in CI | bounded by the bundle budget — a tens-of-kilobytes static bundle loads well within 3 s over 4G |

## Notes

- The bundle is roughly two orders of magnitude under budget, so no
  code-splitting, lazy-loading, or dependency trimming was required.
- Turn resolution is pure synchronous arithmetic over a handful of objects and
  three rivals, so it is roughly three orders of magnitude under budget. No
  optimisation was required.
- Time to interactive is a field metric (device, network, cache state) and
  cannot be measured deterministically in CI. The bundle-size budget is the
  proxy guard; revisit with a real-device or Lighthouse measurement before
  launch if the bundle grows materially.
