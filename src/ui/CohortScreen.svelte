<script lang="ts">
  // Cohort screen — rival cards with sprite avatars. Presentational only.
  import type { CohortEntry } from '../rivals/cohort';
  import type { Rank } from '../state/types';
  import Sprite from './Sprite.svelte';

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

  // Sort by publications descending (rough proxy for career score)
  const sorted = $derived(
    [...entries].sort((a, b) => b.publications - a.publications)
  );
</script>

<div class="tabpane" aria-label="Cohort tracker">
  <div class="panel">
    <div class="panel-head">
      <h3 class="game-title">Your cohort</h3>
      <span class="eyebrow">Race to tenure</span>
    </div>
    <div class="panel-body">
      <div class="cohort">
        {#each sorted as entry, i (entry.rival_id)}
          <div class="rival">
            <Sprite id={'tok-rival' + (i + 1)} cls="ava" size={34} vb="0 0 16 16" />
            <span class="who">
              <b>{i + 1}. {entry.name}</b>
              <small>{RANK_LABELS[entry.rank]}{entry.affiliation_prestige ? ' · prestige ' + entry.affiliation_prestige : ''}</small>
              {#if entry.recent_event}
                <small style="color: var(--amber); display:block">{entry.recent_event}</small>
              {/if}
            </span>
            <span class="rank">
              {entry.publications}p
              <span class="bar">
                <span style="width: {Math.min(100, entry.publications * 4)}%; background: var(--standing)"></span>
              </span>
            </span>
          </div>
        {/each}
        {#if entries.length === 0}
          <p class="diary-empty">No cohort data yet.</p>
        {/if}
      </div>
    </div>
  </div>
</div>
