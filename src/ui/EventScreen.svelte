<script lang="ts">
  // Event screen (specification §5, §4.2; prompts 056, 086). Presents the turn's
  // events as short situations with clear choices. Choosing shows the outcome and
  // (via the store) applies light effects. When every event has been answered,
  // the player continues to the campus. Presentational only.
  import type { SelectedEvent } from '../engine/events';

  interface Props {
    events: SelectedEvent[];
    canContinue: boolean;
    onChoose?: (eventId: string, choiceIndex: number) => void;
    onContinue?: () => void;
  }

  let { events, canContinue, onChoose, onContinue }: Props = $props();
</script>

<section class="event-screen" aria-label="Events this turn">
  <ul class="event-list">
    {#each events as entry (entry.event.event_id)}
      <li class="event" class:done={entry.resolved != null}>
        <h3>{entry.event.title}</h3>
        <p class="body">{entry.event.body}</p>

        {#if entry.resolved != null}
          <p class="result">{entry.resolved}</p>
        {:else if entry.event.choices && entry.event.choices.length > 0}
          <div class="choices">
            {#each entry.event.choices as choice, i (choice.label)}
              <button type="button" onclick={() => onChoose?.(entry.event.event_id, i)}>
                {choice.label}
              </button>
            {/each}
          </div>
        {:else}
          <button type="button" onclick={() => onChoose?.(entry.event.event_id, -1)}>
            Acknowledge
          </button>
        {/if}
      </li>
    {/each}
  </ul>

  <button type="button" class="continue" disabled={!canContinue} onclick={() => onContinue?.()}>
    {canContinue ? 'Get on with the day' : 'Respond to everything first'}
  </button>
</section>

<style>
  .event-screen {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .event-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .event {
    border: 2px solid var(--border);
    padding: 0.75rem;
  }
  .event.done {
    opacity: 0.85;
  }
  .event h3 {
    margin: 0 0 0.25rem;
    font-size: 1rem;
  }
  .body {
    margin: 0 0 0.5rem;
  }
  .result {
    margin: 0;
    font-style: italic;
    border-left: 3px solid var(--accent);
    padding-left: 0.6rem;
  }
  .choices {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .event button {
    font-family: inherit;
    padding: 0.4rem 0.8rem;
    border: 2px solid var(--border);
    background: var(--accent);
    color: var(--accent-text);
    cursor: pointer;
  }
  .continue {
    align-self: flex-start;
    font-family: inherit;
    padding: 0.5rem 1rem;
    border: 2px solid var(--border);
    background: var(--surface);
    color: var(--text);
    cursor: pointer;
  }
  .continue:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
