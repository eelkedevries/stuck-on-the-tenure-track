<script lang="ts">
  // Action allocation screen (specification §5, §4.2): the player distributes the
  // 100-time-point budget across action categories and commits. Outcome
  // resolution is `025`; locations are `050`. A controlled component — changes
  // and commit are emitted to the parent.
  import {
    ACTION_CATEGORIES,
    TURN_TIME_POINTS,
    allocationTotal,
    remainingPoints,
    type ActionCategory,
    type Allocation,
  } from '../engine/actions';

  interface Props {
    allocation: Allocation;
    onAllocate?: (category: ActionCategory, points: number) => void;
    onCommit?: (allocation: Allocation) => void;
  }

  let { allocation, onAllocate, onCommit }: Props = $props();

  const total = $derived(allocationTotal(allocation));
  const remaining = $derived(remainingPoints(allocation));
  const overBudget = $derived(total > TURN_TIME_POINTS);

  const LABELS: Record<ActionCategory, string> = {
    research: 'Research',
    teaching: 'Teaching',
    service: 'Service',
    networking: 'Networking',
    funding: 'Funding',
    personal: 'Personal',
    misconduct: 'Misconduct',
  };

  function handleInput(category: ActionCategory, event: Event) {
    const value = Number((event.currentTarget as HTMLInputElement).value);
    onAllocate?.(category, Number.isFinite(value) ? value : 0);
  }
</script>

<section class="action-screen" aria-label="Allocate time points">
  <p class="budget">
    <span class="label">Remaining</span>
    <span class="value" class:over={overBudget}>{remaining} / {TURN_TIME_POINTS}</span>
  </p>

  <ul class="categories">
    {#each ACTION_CATEGORIES as category (category)}
      <li class="category">
        <label for={`alloc-${category}`}>{LABELS[category]}</label>
        <input
          id={`alloc-${category}`}
          type="number"
          min="0"
          max={TURN_TIME_POINTS}
          value={allocation[category]}
          oninput={(e) => handleInput(category, e)}
        />
      </li>
    {/each}
  </ul>

  <button type="button" disabled={overBudget} onclick={() => onCommit?.(allocation)}>
    Commit ({total} pts)
  </button>
</section>

<style>
  .action-screen {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .budget {
    display: flex;
    justify-content: space-between;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--border);
  }
  .label {
    color: var(--muted);
    text-transform: uppercase;
    font-size: 0.75rem;
    align-self: center;
  }
  .value {
    font-weight: bold;
  }
  .value.over {
    color: #b00020;
  }
  .categories {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .category {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
  }
  .category input {
    width: 5rem;
    font-family: inherit;
    padding: 0.25rem;
    border: 2px solid var(--border);
    background: var(--surface);
    color: var(--text);
  }
  button {
    font-family: inherit;
    padding: 0.5rem 1rem;
    border: 2px solid var(--border);
    background: var(--accent);
    color: var(--accent-text);
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
