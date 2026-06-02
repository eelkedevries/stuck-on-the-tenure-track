<script lang="ts">
  // Desktop pixel-art campus map (specification §4.11, §5). Renders campus
  // locations as a grid of tiles; clicking a tile selects that location. The
  // mobile list is `052`; the ghost penalty is `053`.
  import { ALL_LOCATIONS, type LocationId } from '../locations/types';

  interface Props {
    onSelect?: (id: LocationId) => void;
    selected?: LocationId | null;
  }

  let { onSelect, selected = null }: Props = $props();

  // Fixed pixel-art grid positions (column/row) for the desktop layout.
  const POSITIONS: Record<LocationId, { x: number; y: number }> = {
    office: { x: 1, y: 1 },
    lab: { x: 2, y: 1 },
    library: { x: 3, y: 1 },
    classroom: { x: 1, y: 2 },
    seminar_room: { x: 2, y: 2 },
    cafe_pub: { x: 3, y: 2 },
    home: { x: 1, y: 3 },
    conference_venue: { x: 2, y: 3 },
    funder_portal: { x: 3, y: 3 },
    gym_outdoors: { x: 1, y: 4 },
    health_centre: { x: 2, y: 4 },
  };
</script>

<div class="campus-map" role="group" aria-label="Campus map">
  {#each ALL_LOCATIONS as location (location.id)}
    <button
      type="button"
      class="tile"
      class:selected={selected === location.id}
      aria-pressed={selected === location.id}
      style="grid-column: {POSITIONS[location.id].x}; grid-row: {POSITIONS[location.id].y};"
      onclick={() => onSelect?.(location.id)}
    >
      {location.name}
    </button>
  {/each}
</div>

<style>
  .campus-map {
    display: grid;
    grid-template-columns: repeat(3, minmax(96px, 1fr));
    gap: 8px;
    image-rendering: pixelated;
  }
  .tile {
    font-family: monospace;
    padding: 12px 8px;
    border: 2px solid #333;
    background: #cfeede;
    color: #123;
    cursor: pointer;
    text-align: center;
  }
  .tile.selected {
    background: #6cc89a;
    outline: 2px solid #036;
  }
  .tile:focus-visible {
    outline: 2px solid #036;
  }
</style>
