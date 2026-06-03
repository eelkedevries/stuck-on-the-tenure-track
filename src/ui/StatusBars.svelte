<script lang="ts">
  // Four-track headline HUD (specification §4.1, §4.7, §5; prompt 098).
  // Presents derived, display-only summaries for the main turn screen. Raw
  // resource values stay in the collapsible standing section; no values here
  // are stored or used as mechanics.
  import type { PlayerState } from '../state/types';
  import type { SubGoal } from '../milestones/subgoals';

  interface Props {
    player: PlayerState;
    tenureProgress: number;
    subGoal: SubGoal;
    subGoalProgress: number;
  }

  let { player, tenureProgress, subGoal, subGoalProgress }: Props = $props();

  const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
  const average = (values: number[]) =>
    values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;

  function band(value: number): string {
    if (value >= 75) return 'strong';
    if (value >= 50) return 'steady';
    if (value >= 30) return 'strained';
    return 'fragile';
  }

  function stressNote(stress: number): string {
    if (stress >= 75) return 'stress is dominating the week';
    if (stress >= 50) return 'pressure is noticeable';
    if (stress >= 25) return 'pressure is manageable';
    return 'pressure is low';
  }

  const w = $derived(player.wellbeing);
  const e = $derived(player.expertise);
  const standing = $derived(player.standing);

  const wellbeingScore = $derived(
    clampScore(average([100 - w.stress, w.sleep, w.mood, w.physical])),
  );
  const skillScore = $derived(
    clampScore(average([e.methods, e.theory, e.writing, e.statistics, e.teaching])),
  );
  const standingScore = $derived(
    clampScore(average([standing.reputation, standing.affiliation_prestige, e.politics])),
  );
</script>

<section class="hud" aria-label="Career overview">
  <article class="track-card career">
    <div class="track-heading">
      <h2>Career</h2>
      <strong>{tenureProgress}%</strong>
    </div>
    <div
      class="meter"
      role="meter"
      aria-label="Tenure progress"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={tenureProgress}
    >
      <span class="fill" style="width: {tenureProgress}%"></span>
    </div>
    <p>{subGoal.title}: {subGoalProgress}% of this stage goal.</p>
  </article>

  <article class="track-card wellbeing" class:warn={w.stress >= 70}>
    <div class="track-heading">
      <h2>Wellbeing</h2>
      <strong>{band(wellbeingScore)} · {wellbeingScore}%</strong>
    </div>
    <div
      class="meter"
      role="meter"
      aria-label="Wellbeing summary"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={wellbeingScore}
    >
      <span class="fill" style="width: {wellbeingScore}%"></span>
    </div>
    <p>{stressNote(w.stress)}; sleep, mood, and health are {band(average([w.sleep, w.mood, w.physical]))}.</p>
  </article>

  <article class="track-card skill">
    <div class="track-heading">
      <h2>Skill</h2>
      <strong>{band(skillScore)} · {skillScore}%</strong>
    </div>
    <div
      class="meter"
      role="meter"
      aria-label="Skill summary"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={skillScore}
    >
      <span class="fill" style="width: {skillScore}%"></span>
    </div>
    <p>Methods, theory, writing, statistics, and teaching combined for display.</p>
  </article>

  <article class="track-card standing-track">
    <div class="track-heading">
      <h2>Standing</h2>
      <strong>{band(standingScore)} · {standingScore}%</strong>
    </div>
    <div
      class="meter"
      role="meter"
      aria-label="Standing summary"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={standingScore}
    >
      <span class="fill" style="width: {standingScore}%"></span>
    </div>
    <p>Reputation, institutional signal, and academic politics combined for display.</p>
  </article>
</section>

<style>
  .hud {
    display: grid;
    gap: 0.65rem;
  }
  .track-card {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    border: 2px solid var(--border);
    background: var(--surface);
    padding: 0.65rem;
  }
  .track-heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
  }
  h2 {
    margin: 0;
    font-size: 0.95rem;
  }
  strong {
    font-size: 0.85rem;
    text-transform: uppercase;
  }
  .meter {
    height: 0.75rem;
    border: 1px solid var(--border);
    background: var(--bg);
    overflow: hidden;
  }
  .fill {
    display: block;
    height: 100%;
    background: var(--accent);
    transition: width 0.3s ease;
  }
  .career .fill {
    background: #c79a00;
  }
  .wellbeing .fill {
    background: #4a8;
  }
  .wellbeing.warn .fill {
    background: #b00020;
  }
  .skill .fill {
    background: #5a9bd4;
  }
  .standing-track .fill {
    background: #7b61a8;
  }
  p {
    margin: 0;
    color: var(--muted);
    font-size: 0.85rem;
    line-height: 1.35;
  }
  .wellbeing.warn p {
    color: #7a0015;
  }
  @media (min-width: 42rem) {
    .hud {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
