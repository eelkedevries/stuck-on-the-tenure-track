<script lang="ts">
  // Cohort screen — the race table. With standings supplied it shows the full
  // ordered field including the player; otherwise it falls back to rival cards
  // from public outputs only. Presentational only.
  import type { CohortEntry } from '../rivals/cohort';
  import type { RaceEntry } from '../rivals/race';
  import { ordinal } from '../rivals/race';
  import type { Rank } from '../state/types';
  import Sprite from './Sprite.svelte';

  interface Props {
    entries: CohortEntry[];
    standings?: RaceEntry[];
    playerRank?: string;
  }

  let { entries, standings = [], playerRank = '' }: Props = $props();

  const RANK_LABELS: Record<Rank, string> = {
    undergraduate: "Bachelor's student",
    msc: "Master's student",
    phd: 'PhD student',
    postdoc: 'Postdoc',
    assistant_professor: 'Assistant professor',
    tenured: 'Tenured',
  };

  const byId = $derived(new Map(entries.map((e) => [e.rival_id, e])));
  const maxScore = $derived(Math.max(1, ...standings.map((s) => s.score)));

  function spriteFor(s: RaceEntry): string {
    if (s.isPlayer) return 'tok-player';
    return 'tok-rival' + (entries.findIndex((e) => e.rival_id === s.id) + 1);
  }

  // Fallback ordering when no standings are supplied.
  const sorted = $derived([...entries].sort((a, b) => b.publications - a.publications));
</script>

<div class="tabpane" aria-label="Cohort tracker">
  <div class="panel">
    <div class="panel-head">
      <h3 class="game-title">The race to tenure</h3>
      <span class="eyebrow">First one there wins</span>
    </div>
    <div class="panel-body">
      <div class="cohort">
        {#if standings.length > 0}
          {#each standings as s (s.id)}
            {@const rival = byId.get(s.id)}
            <div class="rival" class:you={s.isPlayer}>
              <span class="race-pos">{ordinal(s.position)}</span>
              <Sprite id={spriteFor(s)} cls="ava" size={34} vb="0 0 16 16" />
              <span class="who">
                <b>{s.isPlayer ? 'You' : s.name}</b>
                <small>
                  {s.isPlayer ? playerRank : rival ? RANK_LABELS[rival.rank] : ''}
                  {s.publications > 0 ? ` · ${s.publications} paper${s.publications === 1 ? '' : 's'}` : ''}
                  {s.h_index > 0 ? ` · h-index ${s.h_index}` : ''}
                </small>
                {#if rival?.recent_event}
                  <small style="color: var(--amber); display:block">{rival.recent_event}</small>
                {/if}
              </span>
              <span class="rank">
                {s.score}
                <span class="bar">
                  <span style="width: {Math.round((s.score / maxScore) * 100)}%; background: var(--standing)"></span>
                </span>
              </span>
            </div>
          {/each}
        {:else}
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
        {/if}
        {#if entries.length === 0}
          <p class="diary-empty">No cohort data yet.</p>
        {/if}
      </div>
    </div>
  </div>
</div>
