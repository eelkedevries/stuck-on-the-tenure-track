<script lang="ts">
  // Event screen (specification §5, §4.2): presents the turn's mandatory and
  // optional events. Event content is authored as data (M15); action allocation
  // is `057`. Presentational only — selection is emitted via `onResolve`.
  import type { ContentEvent } from '../content/types';

  export interface EventEntry {
    event: ContentEvent;
    mandatory: boolean;
  }

  interface Props {
    events: EventEntry[];
    onResolve?: (eventId: string) => void;
  }

  let { events, onResolve }: Props = $props();

  const mandatory = $derived(events.filter((e) => e.mandatory));
  const optional = $derived(events.filter((e) => !e.mandatory));
</script>

<section class="event-screen" aria-label="Events this turn">
  {#if mandatory.length > 0}
    <h2>Mandatory</h2>
    <ul class="event-list">
      {#each mandatory as entry (entry.event.event_id)}
        <li class="event">
          <h3>{entry.event.title}</h3>
          <p>{entry.event.body}</p>
          <button type="button" onclick={() => onResolve?.(entry.event.event_id)}>
            Acknowledge
          </button>
        </li>
      {/each}
    </ul>
  {/if}

  {#if optional.length > 0}
    <h2>Optional</h2>
    <ul class="event-list">
      {#each optional as entry (entry.event.event_id)}
        <li class="event">
          <h3>{entry.event.title}</h3>
          <p>{entry.event.body}</p>
          <button type="button" onclick={() => onResolve?.(entry.event.event_id)}>
            Engage
          </button>
        </li>
      {/each}
    </ul>
  {/if}

  {#if events.length === 0}
    <p class="empty">No events this turn.</p>
  {/if}
</section>

<style>
  .event-screen {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .event-list {
    list-style: none;
    margin: 0 0 0.5rem;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .event {
    border: 2px solid var(--border);
    padding: 0.75rem;
  }
  .event h3 {
    margin: 0 0 0.25rem;
    font-size: 1rem;
  }
  .event p {
    margin: 0 0 0.5rem;
  }
  .event button {
    font-family: inherit;
    padding: 0.4rem 0.8rem;
    border: 2px solid var(--border);
    background: var(--accent);
    color: var(--accent-text);
    cursor: pointer;
  }
  .empty {
    color: var(--muted);
  }
</style>
