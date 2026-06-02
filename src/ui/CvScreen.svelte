<script lang="ts" module>
  // CV end screen (specification §4.12, §5). Renders the end-game state as a
  // psychology-formatted CV: publications, citations, h-index, grants, awards,
  // teaching, service, and final placement. The secondary costs list is `061`
  // and PNG export is `062`. Presentational only — the parent computes the CV
  // data from game state (papers `030`, tenure outcome `049`).
  export interface CvPublication {
    title: string;
    venue: string;
    year: number | null;
    citations: number;
  }

  export interface CvGrant {
    scheme: string;
    funder: string;
    amount: number;
  }

  export interface CvData {
    name: string;
    finalPlacement: string;
    publications: CvPublication[];
    totalCitations: number;
    hIndex: number;
    grants: CvGrant[];
    awards: string[];
    teaching: string[];
    service: string[];
  }
</script>

<script lang="ts">
  interface Props {
    cv: CvData;
  }

  let { cv }: Props = $props();
</script>

<section class="cv-screen" aria-label="Curriculum vitae">
  <header class="cv-header">
    <h2>{cv.name}</h2>
    <p class="placement">{cv.finalPlacement}</p>
    <dl class="metrics">
      <div><dt>Publications</dt><dd>{cv.publications.length}</dd></div>
      <div><dt>Citations</dt><dd>{cv.totalCitations}</dd></div>
      <div><dt>h-index</dt><dd>{cv.hIndex}</dd></div>
      <div><dt>Grants</dt><dd>{cv.grants.length}</dd></div>
    </dl>
  </header>

  <h3>Publications</h3>
  {#if cv.publications.length > 0}
    <ol class="publications">
      {#each cv.publications as pub, i (pub.title + i)}
        <li>
          <span class="title">{pub.title}</span>
          <span class="venue">{pub.venue}{#if pub.year}, {pub.year}{/if}</span>
          <span class="citations">{pub.citations} citation{pub.citations === 1 ? '' : 's'}</span>
        </li>
      {/each}
    </ol>
  {:else}
    <p class="empty">No publications.</p>
  {/if}

  <h3>Grants</h3>
  {#if cv.grants.length > 0}
    <ul class="grants">
      {#each cv.grants as grant, i (grant.scheme + i)}
        <li>
          <span class="scheme">{grant.scheme}</span>
          <span class="funder">{grant.funder}</span>
          <span class="amount">€{grant.amount.toLocaleString('en-GB')}</span>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="empty">No grants awarded.</p>
  {/if}

  <h3>Awards</h3>
  {#if cv.awards.length > 0}
    <ul class="plain">
      {#each cv.awards as award, i (award + i)}<li>{award}</li>{/each}
    </ul>
  {:else}
    <p class="empty">No awards.</p>
  {/if}

  <h3>Teaching</h3>
  {#if cv.teaching.length > 0}
    <ul class="plain">
      {#each cv.teaching as item, i (item + i)}<li>{item}</li>{/each}
    </ul>
  {:else}
    <p class="empty">No teaching recorded.</p>
  {/if}

  <h3>Service</h3>
  {#if cv.service.length > 0}
    <ul class="plain">
      {#each cv.service as item, i (item + i)}<li>{item}</li>{/each}
    </ul>
  {:else}
    <p class="empty">No service recorded.</p>
  {/if}
</section>

<style>
  .cv-screen {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .cv-header {
    border-bottom: 2px solid var(--border);
    padding-bottom: 0.5rem;
  }
  .cv-header h2 {
    margin: 0;
  }
  .placement {
    margin: 0.25rem 0 0.5rem;
    color: var(--muted);
  }
  .metrics {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.5rem;
    margin: 0;
  }
  .metrics dt {
    color: var(--muted);
    text-transform: uppercase;
    font-size: 0.7rem;
  }
  .metrics dd {
    margin: 0;
    font-weight: bold;
    font-size: 1.1rem;
  }
  h3 {
    margin: 0.5rem 0 0;
    font-size: 1rem;
  }
  .publications {
    margin: 0;
    padding-left: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .publications .title {
    font-weight: bold;
  }
  .publications .venue,
  .publications .citations {
    display: block;
    color: var(--muted);
    font-size: 0.85rem;
  }
  .grants,
  .plain {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .grants li {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0.75rem;
  }
  .grants .scheme {
    font-weight: bold;
  }
  .grants .funder,
  .grants .amount {
    color: var(--muted);
    font-size: 0.85rem;
  }
  .empty {
    color: var(--muted);
    margin: 0;
  }
</style>
