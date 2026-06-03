<script lang="ts">
  // Campus board (specification §4.11; prompt 078). The primary turn interface:
  // the desktop map and mobile list show the campus, moving to a location costs
  // time, and the current location's bound actions can be given time from the
  // remaining budget. Presentational — movement, actions, and end-turn are
  // emitted to the store, which owns the time economy. Existing CampusMap and
  // LocationList are reused unchanged.
  import CampusMap from './CampusMap.svelte';
  import { ALL_LOCATIONS, type LocationId } from '../locations/types';
  import { TURN_TIME_POINTS, type ActionCategory, type Allocation } from '../engine/actions';
  import type { BoardActivity } from '../locations/stages';

  interface Props {
    currentLocation: LocationId;
    focus: string;
    timeRemaining: number;
    activities: BoardActivity[];
    spent: Allocation;
    onMove?: (id: LocationId) => void;
    onAct?: (category: ActionCategory, points: number) => void;
    onRelax?: () => void;
    onCohort?: () => void;
  }

  let {
    currentLocation,
    focus,
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
      <span class="label">Time left</span>
      <span class="value">{timeRemaining} / {TURN_TIME_POINTS}</span>
    </p>
  </header>

  <p class="focus">{focus}</p>

  <CampusMap selected={currentLocation} onSelect={(id) => onMove?.(id)} />
  <p class="movehint">Tap a place to travel there — further away costs more time.</p>

  <h3>Activities here</h3>
  {#if activities.length > 0}
    <ul class="actions">
      {#each activities as activity, i (activity.label + i)}
        <li>
          <button
            type="button"
            class="action-card"
            disabled={timeRemaining < activity.timeCost}
            title={activity.flavour}
            onclick={() => onAct?.(activity.category, activity.timeCost)}
          >
            <span class="action-main">
              <span class="action-label">{activity.label}</span>
              <span class="action-effect">{activity.effectHint}</span>
              {#if activity.flavour}<span class="action-flavour">{activity.flavour}</span>{/if}
            </span>
            <span class="action-meta">
              <span class="cost">{activity.timeCost}t</span>
              {#if spent[activity.category] > 0}<span class="spent">{spent[activity.category]}t spent</span>{/if}
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
      Relax (let the rest of the day pass)
    </button>
    <button type="button" onclick={() => onCohort?.()}>Cohort</button>
  </nav>
  <p class="time-note">The day ends on its own once your time runs out.</p>
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
  .focus {
    margin: 0;
    font-style: italic;
    color: var(--muted);
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
  .action-main {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }
  .action-label {
    font-weight: bold;
  }
  .action-effect,
  .action-flavour {
    color: var(--muted);
    font-size: 0.8rem;
  }
  .action-flavour {
    font-style: italic;
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
