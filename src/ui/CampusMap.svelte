<script lang="ts">
  // Square campus board (specification §4.11, §5; prompts 051, 090). Locations sit
  // on a grid; tapping one travels there at a distance-based time cost (shown on
  // each tile). A player token marks the current location and animates when you
  // travel. Works on desktop and mobile (the board scales to width) and is
  // keyboard-navigable. Travel is emitted via onSelect.
  import { ALL_LOCATIONS, type LocationId } from '../locations/types';
  import { BOARD_SIZE, COORDS, travelCost } from '../locations/board';

  interface Props {
    selected?: LocationId | null;
    onSelect?: (id: LocationId) => void;
  }

  let { selected = null, onSelect }: Props = $props();

  const cell = 100 / BOARD_SIZE; // percent per cell
  const current = $derived((selected ?? 'office') as LocationId);
  const tokenPos = $derived(COORDS[current]);
</script>

<div class="board" role="group" aria-label="Campus board">
  {#each ALL_LOCATIONS as location (location.id)}
    {@const pos = COORDS[location.id]}
    {@const here = location.id === current}
    {@const cost = travelCost(current, location.id)}
    <button
      type="button"
      class="tile"
      class:here
      style="left: {pos.x * cell}%; top: {pos.y * cell}%; width: {cell}%; height: {cell}%;"
      aria-label={here ? `${location.name}, you are here` : `${location.name}, travel ${cost} time`}
      aria-pressed={here}
      disabled={here}
      onclick={() => onSelect?.(location.id)}
    >
      <span class="name">{location.name}</span>
      <span class="cost">{here ? 'here' : `${cost}t`}</span>
    </button>
  {/each}

  <div
    class="token"
    style="left: {tokenPos.x * cell}%; top: {tokenPos.y * cell}%; width: {cell}%; height: {cell}%;"
    aria-hidden="true"
  >
    <span class="dot">●</span>
  </div>
</div>

<style>
  .board {
    position: relative;
    width: 100%;
    max-width: 30rem;
    margin: 0 auto;
    aspect-ratio: 1 / 1;
    border: 2px solid var(--border);
    image-rendering: pixelated;
  }
  .tile {
    position: absolute;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: 2px;
    font-family: inherit;
    border: 2px solid var(--border);
    background: var(--surface);
    color: var(--text);
    cursor: pointer;
    overflow: hidden;
    text-align: center;
  }
  .tile .name {
    font-size: 0.6rem;
    line-height: 1.05;
  }
  .tile .cost {
    font-size: 0.6rem;
    color: var(--muted);
  }
  .tile.here {
    background: var(--accent);
    color: var(--accent-text);
    cursor: default;
  }
  .tile.here .cost {
    color: var(--accent-text);
  }
  .token {
    position: absolute;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 2px;
    pointer-events: none;
    transition:
      left 0.4s ease,
      top 0.4s ease;
  }
  .dot {
    color: #b00020;
    font-size: 0.9rem;
    line-height: 1;
    text-shadow: 0 0 2px #fff;
  }
</style>
