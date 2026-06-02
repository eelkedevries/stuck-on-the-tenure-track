<script lang="ts">
  // Deadline pressure board (specification §4.11a; prompt 080). Shows pending
  // deadlines grouped by urgency so the player can see, at a glance, what is due
  // now, soon, later, or already overdue. Urgency is conveyed by a text label
  // (not colour alone) for accessibility. Presentational only.
  import { urgencyFor } from '../deadlines/deadlines';
  import type { Deadline, Urgency } from '../deadlines/types';

  interface Props {
    deadlines: Deadline[];
    currentDate: string;
  }

  let { deadlines, currentDate }: Props = $props();

  const ORDER: Urgency[] = ['overdue', 'due_now', 'soon', 'later'];
  const URGENCY_LABEL: Record<Urgency, string> = {
    overdue: 'Overdue',
    due_now: 'Due now',
    soon: 'Soon',
    later: 'Later',
  };

  const sorted = $derived(
    [...deadlines]
      .map((d) => ({ deadline: d, urgency: urgencyFor(d, currentDate) }))
      .sort((a, b) => ORDER.indexOf(a.urgency) - ORDER.indexOf(b.urgency)),
  );
</script>

<section class="deadlines" aria-label="Deadlines">
  <h3>Deadlines</h3>
  {#if sorted.length > 0}
    <ul>
      {#each sorted as { deadline, urgency } (deadline.deadline_id)}
        <li class="deadline urgency-{urgency}">
          <span class="badge">{URGENCY_LABEL[urgency]}</span>
          <span class="title">{deadline.title}</span>
          <span class="due">{deadline.due_date}</span>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="empty">Nothing due. Enjoy it while it lasts.</p>
  {/if}
</section>

<style>
  .deadlines {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  h3 {
    margin: 0;
    font-size: 1rem;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .deadline {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    border: 2px solid var(--border);
    padding: 0.35rem 0.5rem;
  }
  .badge {
    font-size: 0.7rem;
    text-transform: uppercase;
    font-weight: bold;
    padding: 0.1rem 0.4rem;
    border: 1px solid var(--border);
  }
  .title {
    font-weight: bold;
  }
  .due {
    margin-left: auto;
    color: var(--muted);
    font-size: 0.8rem;
  }
  .urgency-overdue .badge {
    background: #b00020;
    color: #fff;
    border-color: #b00020;
  }
  .urgency-due_now .badge {
    background: var(--accent);
    color: var(--accent-text);
  }
  .empty {
    color: var(--muted);
    margin: 0;
  }
</style>
