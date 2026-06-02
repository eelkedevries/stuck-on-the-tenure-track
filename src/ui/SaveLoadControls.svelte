<script lang="ts">
  // Save/load controls (specification §5): new game, resume, and reset, bound to
  // the single-slot save system (`020`). One slot only — no multiple slots,
  // accounts, or cloud sync (§9). The parent wires the callbacks to the storage
  // functions.
  interface Props {
    hasSave: boolean;
    onNewGame?: () => void;
    onResume?: () => void;
    onReset?: () => void;
  }

  let { hasSave, onNewGame, onResume, onReset }: Props = $props();
</script>

<section class="save-controls" aria-label="Game">
  <button type="button" class="primary" onclick={() => onNewGame?.()}>New game</button>
  <button type="button" disabled={!hasSave} onclick={() => onResume?.()}>Resume</button>
  <button type="button" class="danger" disabled={!hasSave} onclick={() => onReset?.()}>
    Reset
  </button>
</section>

<style>
  .save-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  button {
    font-family: inherit;
    padding: 0.5rem 1rem;
    border: 2px solid var(--border);
    background: var(--surface);
    color: var(--text);
    cursor: pointer;
  }
  button.primary {
    background: var(--accent);
    color: var(--accent-text);
  }
  button.danger {
    border-color: #b00020;
    color: #b00020;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
