<script lang="ts">
  // End-of-turn diary (specification §4.2, §5; prompt 081). Renders the recap
  // lines built from recorded state, then a control to continue. Presentational.
  import type { Recap } from './recap';

  interface Props {
    recap: Recap;
    onContinue?: () => void;
  }

  let { recap, onContinue }: Props = $props();
</script>

<section class="diary" aria-label="End-of-turn diary">
  <h2>Turn {recap.turn} — diary</h2>
  {#if recap.majorMilestones.length > 0}
    <div class="milestones" aria-label="Major career milestones">
      {#each recap.majorMilestones as milestone (milestone.title)}
        <article class="milestone">
          <p class="eyebrow">Major milestone</p>
          <h3>{milestone.title}</h3>
          <p>{milestone.achieved}</p>
          <p><strong>{milestone.next}</strong> {milestone.meaning}</p>
        </article>
      {/each}
    </div>
  {/if}
  <ul>
    {#each recap.lines as line, i (i)}
      <li>{line}</li>
    {/each}
  </ul>
  <button type="button" class="primary" onclick={() => onContinue?.()}>Continue</button>
</section>

<style>
  .diary {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  h2,
  h3 {
    margin: 0;
  }
  .milestones {
    display: grid;
    gap: 0.5rem;
  }
  .milestone {
    border: 3px double var(--accent);
    background: var(--surface);
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  .milestone p {
    margin: 0;
    line-height: 1.35;
  }
  .eyebrow {
    color: var(--muted);
    font-size: 0.72rem;
    font-weight: bold;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  li {
    border-left: 3px solid var(--accent);
    padding: 0.2rem 0 0.2rem 0.6rem;
  }
  button {
    align-self: flex-start;
    font-family: inherit;
    padding: 0.5rem 1rem;
    border: 2px solid var(--border);
    background: var(--accent);
    color: var(--accent-text);
    cursor: pointer;
  }
</style>
