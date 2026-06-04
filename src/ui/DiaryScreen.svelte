<script lang="ts">
  // End-of-turn diary recap screen. Presentational.
  import type { Recap } from './recap';
  import Sprite from './Sprite.svelte';

  interface Props {
    recap: Recap;
    onContinue?: () => void;
  }

  let { recap, onContinue }: Props = $props();
</script>

<div class="c-main scroll" aria-label="End-of-turn diary">
  <div class="panel">
    <div class="panel-head">
      <h3 class="game-title">Turn {recap.turn} — diary</h3>
      <span class="eyebrow">Recap</span>
    </div>
    <div class="panel-body">
      {#if recap.majorMilestones.length > 0}
        {#each recap.majorMilestones as milestone (milestone.title)}
          <div class="diploma" style="margin-bottom: 12px">
            <Sprite id="ui-cap" cls="seal" size={44} />
            <span class="txt">
              <b>{milestone.title}</b>
              <small>{milestone.achieved}</small>
              <small>{milestone.next} {milestone.meaning}</small>
            </span>
          </div>
        {/each}
      {/if}

      {#if recap.lines.length > 0}
        <ul class="diary-list">
          {#each recap.lines as line, i (i)}
            <li><span class="tick">—</span><span>{line}</span></li>
          {/each}
        </ul>
      {:else}
        <p class="diary-empty">Nothing to report this turn.</p>
      {/if}

      <div style="margin-top: 16px">
        <button class="btn btn-primary" onclick={() => onContinue?.()}>Continue ▸</button>
      </div>
    </div>
  </div>
</div>
