<script lang="ts">
  // Scrollable mobile location list (specification §4.11, §5). Renders campus
  // locations as a vertical, scrollable list; tapping a row selects that
  // location. The desktop map is `051`; the ghost penalty is `053`.
  import { ALL_LOCATIONS, type LocationId } from '../locations/types';

  interface Props {
    onSelect?: (id: LocationId) => void;
    selected?: LocationId | null;
  }

  let { onSelect, selected = null }: Props = $props();
</script>

<ul class="location-list" aria-label="Locations">
  {#each ALL_LOCATIONS as location (location.id)}
    <li>
      <button
        type="button"
        class:selected={selected === location.id}
        aria-pressed={selected === location.id}
        onclick={() => onSelect?.(location.id)}
      >
        <span class="name">{location.name}</span>
        <span class="actions">{location.actions.join(', ')}</span>
      </button>
    </li>
  {/each}
</ul>

<style>
  .location-list {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 100vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .location-list button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 14px 12px;
    font-family: monospace;
    text-align: left;
    border: 0;
    border-bottom: 1px solid #ccc;
    background: #fff;
    color: #123;
    cursor: pointer;
  }
  .location-list .selected {
    background: #def0ff;
  }
  .name {
    font-weight: bold;
  }
  .actions {
    color: #666;
    font-size: 0.8em;
  }
</style>
