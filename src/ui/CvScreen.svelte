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

  // The secondary list of personal costs recorded across the career
  // (specification §4.12). Rendered read-only on the CV (`061`).
  export interface CvCosts {
    relationshipsEnded: number;
    hobbiesAbandoned: number;
    sickLeaveTurns: number;
    chronicConditions: string[];
    shortTermCities: number;
    sleepDeficit: number;
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
    costs: CvCosts;
  }
</script>

<script lang="ts">
  interface Props {
    cv: CvData;
  }

  let { cv }: Props = $props();

  let cvRoot: HTMLElement | undefined = $state();

  // Rasterise the CV to a PNG entirely in the browser (specification §4.12):
  // serialise the rendered node into an SVG foreignObject, draw it to a canvas,
  // and download the result. No backend and no shareable URL (out of scope).
  async function exportPng(): Promise<void> {
    const node = cvRoot;
    if (!node || typeof window === 'undefined') return;

    const rect = node.getBoundingClientRect();
    const width = Math.ceil(rect.width) || 600;
    const height = Math.ceil(rect.height) || 800;

    const clone = node.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.cv-export').forEach((el) => el.remove());
    const markup = new XMLSerializer().serializeToString(clone);

    const style =
      '<style>' +
      '.cv-render{font-family:system-ui,sans-serif;color:#111;background:#fff;' +
      'padding:1rem;box-sizing:border-box;width:100%;height:100%}' +
      '.cv-render h2{margin:0 0 .25rem}.cv-render h3{margin:.5rem 0 .25rem}' +
      '.cv-render dt{color:#555;font-size:.8rem}.cv-render dd{margin:0;font-weight:bold}' +
      '.cv-render ol,.cv-render ul{margin:0;padding-left:1.25rem}' +
      '</style>';
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
      '<foreignObject width="100%" height="100%">' +
      `<div xmlns="http://www.w3.org/1999/xhtml" class="cv-render">${style}${markup}</div>` +
      '</foreignObject></svg>';

    const svgUrl = URL.createObjectURL(
      new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }),
    );
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('CV image failed to render.'));
        img.src = svgUrl;
      });

      const scale = window.devicePixelRatio || 1;
      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(scale, scale);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement('a');
        const safeName = cv.name.trim().replace(/\s+/g, '_') || 'cv';
        link.download = `${safeName}_cv.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      }, 'image/png');
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
  }
</script>

<section class="cv-screen" aria-label="Curriculum vitae" bind:this={cvRoot}>
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

  <h3 class="costs-heading">The costs</h3>
  <dl class="costs">
    <div><dt>Relationships ended</dt><dd>{cv.costs.relationshipsEnded}</dd></div>
    <div><dt>Hobbies abandoned</dt><dd>{cv.costs.hobbiesAbandoned}</dd></div>
    <div>
      <dt>Sick leave</dt>
      <dd>{cv.costs.sickLeaveTurns} turn{cv.costs.sickLeaveTurns === 1 ? '' : 's'}</dd>
    </div>
    <div><dt>Short-term cities</dt><dd>{cv.costs.shortTermCities}</dd></div>
    <div><dt>Sleep deficit</dt><dd>{cv.costs.sleepDeficit}</dd></div>
    <div class="conditions">
      <dt>Chronic conditions</dt>
      <dd>
        {#if cv.costs.chronicConditions.length > 0}
          {cv.costs.chronicConditions.join(', ')}
        {:else}
          None
        {/if}
      </dd>
    </div>
  </dl>

  <div class="cv-export">
    <button type="button" onclick={exportPng}>Download as PNG</button>
  </div>
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
  .costs-heading {
    margin-top: 0.75rem;
    padding-top: 0.5rem;
    border-top: 2px solid var(--border);
  }
  .costs {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.3rem 1rem;
    margin: 0;
  }
  .costs dt {
    color: var(--muted);
    font-size: 0.85rem;
  }
  .costs dd {
    margin: 0;
    font-weight: bold;
  }
  @media (min-width: 32rem) {
    .costs {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  .cv-export {
    margin-top: 0.5rem;
  }
  .cv-export button {
    font-family: inherit;
    padding: 0.5rem 1rem;
    border: 2px solid var(--border);
    background: var(--accent);
    color: var(--accent-text);
    cursor: pointer;
  }
</style>
