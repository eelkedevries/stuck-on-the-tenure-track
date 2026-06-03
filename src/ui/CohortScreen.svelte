<script lang="ts">
  // Cohort screen (specification §5, §4.9): renders the public cohort tracker —
  // rank, publications, h-index, prestige, and recent events. Private rival
  // state is never passed here (the tracker projects it out in `047`). The CV
  // screen is `060`. Presentational only.
  import type { CohortEntry } from '../rivals/cohort';
  import type { Rank } from '../state/types';

  interface Props {
    entries: CohortEntry[];
  }

  let { entries }: Props = $props();

  const RANK_LABELS: Record<Rank, string> = {
    undergraduate: "Bachelor's student",
    msc: "Master's student",
    phd: 'PhD student',
    postdoc: 'Postdoc',
    assistant_professor: 'Assistant professor',
    tenured: 'Tenured',
  };
</script>

<section class="cohort-screen" aria-label="Cohort tracker">
  <h2>Cohort</h2>
  <table>
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Rank</th>
        <th scope="col">Papers</th>
        <th scope="col">h-index</th>
        <th scope="col">Prestige</th>
      </tr>
    </thead>
    <tbody>
      {#each entries as entry (entry.rival_id)}
        <tr>
          <th scope="row">
            {entry.name}
            {#if entry.recent_event}
              <span class="event">— {entry.recent_event}</span>
            {/if}
          </th>
          <td>{RANK_LABELS[entry.rank]}</td>
          <td>{entry.publications}</td>
          <td>{entry.h_index}</td>
          <td>{entry.affiliation_prestige}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</section>

<style>
  .cohort-screen {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }
  th,
  td {
    border: 1px solid var(--border);
    padding: 0.4rem 0.5rem;
    text-align: left;
  }
  thead th {
    background: var(--accent);
    color: var(--accent-text);
  }
  .event {
    display: block;
    color: var(--muted);
    font-size: 0.8rem;
    font-weight: normal;
  }
</style>
