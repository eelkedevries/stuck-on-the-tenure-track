<script lang="ts">
  // Deadline pressure board — urgency rows with state word.
  import { urgencyFor } from '../deadlines/deadlines';
  import type { Deadline, Urgency } from '../deadlines/types';

  interface Props {
    deadlines: Deadline[];
    currentDate: string;
  }

  let { deadlines, currentDate }: Props = $props();

  const ORDER: Urgency[] = ['overdue', 'due_now', 'soon', 'later'];
  const WORD: Record<Urgency, string> = {
    overdue: 'OVERDUE',
    due_now: 'DUE NOW',
    soon:    'SOON',
    later:   'LATER',
  };
  const COLOUR: Record<Urgency, string> = {
    overdue: 'var(--danger)',
    due_now: 'var(--amber)',
    soon:    'var(--ok)',
    later:   'var(--muted)',
  };

  const sorted = $derived(
    [...deadlines]
      .map((d) => ({ deadline: d, urgency: urgencyFor(d, currentDate) }))
      .sort((a, b) => ORDER.indexOf(a.urgency) - ORDER.indexOf(b.urgency)),
  );
</script>

{#if sorted.length > 0}
  <div class="deadline-board" aria-label="Deadlines">
    {#each sorted as { deadline, urgency } (deadline.deadline_id)}
      <div class="drow urgency-{urgency}">
        <span class="dword" style="color: {COLOUR[urgency]}">{WORD[urgency]}</span>
        <span class="dtitle">{deadline.title}</span>
        <span class="ddue">{deadline.due_date}</span>
      </div>
    {/each}
  </div>
{/if}
