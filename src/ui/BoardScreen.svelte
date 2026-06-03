<script lang="ts">
  // Campus board (specification §4.11; prompt 078). The primary turn interface:
  // the desktop map and mobile list show the campus, moving to a location costs
  // time, and the current location's bound actions can be given time from the
  // remaining budget. Presentational — movement, actions, and end-turn are
  // emitted to the store, which owns the time economy. Existing CampusMap and
  // LocationList are reused unchanged.
  import CampusMap from './CampusMap.svelte';
  import { ALL_LOCATIONS, type LocationId } from '../locations/types';
  import { TURN_TIME_POINTS, type ActionCategory } from '../engine/actions';
  import type { BoardActivity } from '../locations/stages';

  interface Props {
    currentLocation: LocationId;
    focus: string;
    personality: string;
    timeRemaining: number;
    activities: BoardActivity[];
    spent: Record<string, number>;
    onMove?: (id: LocationId) => void;
    onAct?: (activityId: string, category: ActionCategory, points: number) => void;
    onRelax?: () => void;
    onCohort?: () => void;
  }

  let {
    currentLocation,
    focus,
    personality,
    timeRemaining,
    activities,
    spent,
    onMove,
    onAct,
    onRelax,
    onCohort,
  }: Props = $props();

  const currentName = $derived(
    ALL_LOCATIONS.find((l) => l.id === currentLocation)?.name ?? currentLocation,
  );

</script>

<section class="board" aria-label="Campus board">
  <header class="board-status">
    <p class="here"><span class="label">At</span> <span class="value">{currentName}</span></p>
    <p class="time">
      <span class="label">Day left</span>
      <span class="value">{timeRemaining} / {TURN_TIME_POINTS}</span>
    </p>
  </header>

  <div class="location-copy">
    <p class="focus">{focus}</p>
    <p class="personality">{personality}</p>
  </div>

  <CampusMap selected={currentLocation} onSelect={(id) => onMove?.(id)} />
  <p class="movehint">Tap a place to move the red dot. Travel spends time, so nearby choices are cheaper.</p>

  <h3>Choose an action here</h3>
  {#if activities.length > 0}
    <ul class="actions">
      {#each activities as activity (activity.id)}
        <li>
          <button
            type="button"
            class="action-card"
            class:priority={activity.badge}
            disabled={timeRemaining < activity.timeCost}
            title={activity.flavour}
            onclick={() => onAct?.(activity.id, activity.category, activity.timeCost)}
          >
            <span class="action-main">
              {#if activity.badge}<span class="action-badge">{activity.badge}</span>{/if}
              <span class="action-label">{activity.label}</span>
              <span class="action-effect">{activity.effectHint}</span>
              <span class="effect-preview" aria-label="Likely effects">
                <span class="effect-group"><span class="effect-title">Helps</span> {activity.positiveEffects.join(' · ')}</span>
                <span class="effect-group"><span class="effect-title">Costs</span> {activity.negativeEffects.join(' · ')}</span>
              </span>
              {#if activity.flavour}<span class="action-flavour">{activity.flavour}</span>{/if}
            </span>
            <span class="action-meta">
              <span class="cost">{activity.timeCost}t</span>
              {#if (spent[activity.id] ?? 0) > 0}<span class="spent">{spent[activity.id]}t spent</span>{/if}
            </span>
          </button>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="empty">Nothing to do here.</p>
  {/if}

  <nav class="board-actions" aria-label="Turn controls">
    <button type="button" class="primary" onclick={() => onRelax?.()}>
      Rest until the day ends
    </button>
    <button type="button" onclick={() => onCohort?.()}>Cohort</button>
  </nav>
  <p class="time-note">Keep spending time, or rest to turn what remains into recovery.</p>
</section>

<style>
  .board {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .board-status {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.5rem;
    align-items: baseline;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--border);
  }
  .label {
    color: var(--muted);
    text-transform: uppercase;
    font-size: 0.7rem;
  }
  .value {
    font-weight: bold;
  }
  .movehint {
    margin: 0;
    color: var(--muted);
    font-size: 0.8rem;
    text-align: center;
  }
  .location-copy {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .focus,
  .personality {
    margin: 0;
    color: var(--muted);
  }
  .focus {
    font-style: italic;
  }
  .personality {
    font-size: 0.85rem;
  }
  .actions {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .action-card {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.7rem;
    border: 2px solid var(--border);
    background: var(--surface);
    color: var(--text);
    font-family: inherit;
    text-align: left;
    cursor: pointer;
  }
  .action-card.priority {
    border-style: double;
    border-width: 4px;
    background: color-mix(in srgb, var(--accent) 10%, var(--surface));
  }
  .action-main {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }
  .action-label {
    font-weight: bold;
  }
  .action-badge {
    align-self: flex-start;
    padding: 0.08rem 0.35rem;
    border: 1px solid var(--border);
    text-transform: uppercase;
    font-size: 0.65rem;
    font-weight: bold;
    letter-spacing: 0.03em;
  }
  .action-effect,
  .action-flavour {
    color: var(--muted);
    font-size: 0.8rem;
  }
  .action-flavour {
    font-style: italic;
  }
  .effect-preview {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0.5rem;
    margin-top: 0.1rem;
    font-size: 0.75rem;
  }
  .effect-group {
    color: var(--muted);
  }
  .effect-title {
    color: var(--text);
    font-weight: bold;
  }
  .action-meta {
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.15rem;
  }
  .cost {
    font-weight: bold;
  }
  .spent {
    color: var(--accent);
    font-size: 0.75rem;
  }
  .board-actions button {
    font-family: inherit;
    padding: 0.35rem 0.7rem;
    border: 2px solid var(--border);
    background: var(--surface);
    color: var(--text);
    cursor: pointer;
  }
  .board-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  .board-actions .primary {
    background: var(--accent);
    color: var(--accent-text);
  }
  .time-note {
    margin: 0;
    color: var(--muted);
    font-size: 0.8rem;
  }
  button:disabled,
  .action-card:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .empty {
    color: var(--muted);
  }
</style>
