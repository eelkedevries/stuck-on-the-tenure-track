<script lang="ts">
  // Progression bars (specification §4.1, §4.7; prompt 089). Shows the main
  // things the player manages as labelled bars: emotional state (stress), sleep,
  // mood, physical health, and progress toward tenure. Values are shown as text
  // as well as bar width (not colour alone). Presentational.
  import type { PlayerState } from '../state/types';

  interface Props {
    player: PlayerState;
    tenureProgress: number;
    subGoalLabel: string;
    subGoalProgress: number;
  }

  let { player, tenureProgress, subGoalLabel, subGoalProgress }: Props = $props();

  const w = $derived(player.wellbeing);
  const stressHigh = $derived(w.stress >= 70);
</script>

<section class="bars" aria-label="Your state">
  <div class="bar stress" class:warn={stressHigh}>
    <span class="label">Stress</span>
    <span class="track"><span class="fill" style="width: {w.stress}%"></span></span>
    <span class="num">{w.stress}</span>
  </div>
  {#if stressHigh}
    <p class="warning">You're frazzled. Find time to relax before it costs you.</p>
  {/if}

  <div class="bar">
    <span class="label">Sleep</span>
    <span class="track"><span class="fill" style="width: {w.sleep}%"></span></span>
    <span class="num">{w.sleep}</span>
  </div>
  <div class="bar">
    <span class="label">Mood</span>
    <span class="track"><span class="fill" style="width: {w.mood}%"></span></span>
    <span class="num">{w.mood}</span>
  </div>
  <div class="bar">
    <span class="label">Health</span>
    <span class="track"><span class="fill" style="width: {w.physical}%"></span></span>
    <span class="num">{w.physical}</span>
  </div>
  <div class="goals">
    <p class="goalnow">Right now — {subGoalLabel}</p>
    <div class="bar subgoal">
      <span class="label">This stage</span>
      <span class="track"><span class="fill" style="width: {subGoalProgress}%"></span></span>
      <span class="num">{subGoalProgress}%</span>
    </div>
    <div class="bar tenure">
      <span class="label">Tenure</span>
      <span class="track"><span class="fill" style="width: {tenureProgress}%"></span></span>
      <span class="num">{tenureProgress}%</span>
    </div>
  </div>
</section>

<style>
  .bars {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .bar {
    display: grid;
    grid-template-columns: 4.5rem 1fr 2.5rem;
    align-items: center;
    gap: 0.5rem;
  }
  .label {
    font-size: 0.8rem;
    color: var(--muted);
    text-transform: uppercase;
  }
  .track {
    height: 0.7rem;
    border: 1px solid var(--border);
    background: var(--surface);
    overflow: hidden;
  }
  .fill {
    display: block;
    height: 100%;
    background: var(--accent);
    transition: width 0.3s ease;
  }
  .num {
    font-size: 0.8rem;
    text-align: right;
    font-weight: bold;
  }
  .stress .fill {
    background: #4a8;
  }
  .stress.warn .fill {
    background: #b00020;
  }
  .tenure .fill {
    background: #c79a00;
  }
  .subgoal .fill {
    background: #5a9bd4;
  }
  .goals {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin-top: 0.4rem;
    padding-top: 0.4rem;
    border-top: 1px solid var(--border);
  }
  .goalnow {
    margin: 0;
    font-size: 0.85rem;
    font-weight: bold;
  }
  .warning {
    margin: 0;
    color: #b00020;
    font-size: 0.8rem;
  }
</style>
