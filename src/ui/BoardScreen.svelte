<script lang="ts">
  // Campus board (specification §4.11; prompt 078). The primary turn interface:
  // the desktop map and mobile list show the campus, moving to a location costs
  // time, and the current location's bound actions can be given time from the
  // remaining budget. Presentational — movement, actions, and end-turn are
  // emitted to the store, which owns the time economy. Existing CampusMap and
  // LocationList are reused unchanged.
  import CampusMap from './CampusMap.svelte';
  import LocationList from './LocationList.svelte';
  import { ALL_LOCATIONS, type LocationId } from '../locations/types';
  import { TURN_TIME_POINTS, type ActionCategory, type Allocation } from '../engine/actions';
  import type { Activity } from '../locations/stages';

  interface Props {
    currentLocation: LocationId;
    focus: string;
    timeRemaining: number;
    moveCost: number;
    activities: Activity[];
    spent: Allocation;
    onMove?: (id: LocationId) => void;
    onAct?: (category: ActionCategory, points: number) => void;
    onActMax?: (category: ActionCategory) => void;
    onEndTurn?: () => void;
    onCohort?: () => void;
  }

  let {
    currentLocation,
    focus,
    timeRemaining,
    moveCost,
    activities,
    spent,
    onMove,
    onAct,
    onActMax,
    onEndTurn,
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
    <p class="movecost">Moving costs {moveCost} time</p>
  </header>

  <p class="focus">{focus}</p>

  <div class="board-desktop">
    <CampusMap selected={currentLocation} onSelect={(id) => onMove?.(id)} />
  </div>
  <div class="board-mobile">
    <LocationList selected={currentLocation} onSelect={(id) => onMove?.(id)} />
  </div>

  <h3>Activities here</h3>
  {#if activities.length > 0}
    <ul class="actions">
      {#each activities as activity, i (activity.label + i)}
        <li>
          <span class="action-label">{activity.label}</span>
          {#if spent[activity.category] > 0}<span class="spent">{spent[activity.category]} on {activity.category}</span>{/if}
          <span class="buttons">
            <button type="button" disabled={timeRemaining < 10} onclick={() => onAct?.(activity.category, 10)}>+10</button>
            <button type="button" disabled={timeRemaining < 25} onclick={() => onAct?.(activity.category, 25)}>+25</button>
            <button type="button" disabled={timeRemaining <= 0} onclick={() => onActMax?.(activity.category)}>All</button>
          </span>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="empty">Nothing to do here.</p>
  {/if}

  <nav class="board-actions" aria-label="Turn controls">
    <button type="button" class="primary" onclick={() => onEndTurn?.()}>End turn</button>
    <button type="button" onclick={() => onCohort?.()}>Cohort</button>
  </nav>
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
  .movecost {
    color: var(--muted);
    font-size: 0.8rem;
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
  .actions li {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }
  .action-label {
    font-weight: bold;
    min-width: 6rem;
  }
  .spent {
    color: var(--muted);
    font-size: 0.8rem;
  }
  .buttons {
    margin-left: auto;
    display: flex;
    gap: 0.25rem;
  }
  .buttons button,
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
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  .board-actions .primary {
    background: var(--accent);
    color: var(--accent-text);
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .empty {
    color: var(--muted);
  }
  /* Desktop shows the pixel-art map; mobile shows the scrollable list. */
  .board-mobile {
    display: block;
  }
  .board-desktop {
    display: none;
  }
  @media (min-width: 40rem) {
    .board-mobile {
      display: none;
    }
    .board-desktop {
      display: block;
    }
  }
</style>
