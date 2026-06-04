<script lang="ts">
  // Compact HUD strip — 5 segmented bars in dark console style.
  import type { PlayerState } from '../state/types';
  import type { SubGoal } from '../milestones/subgoals';

  interface Props {
    player: PlayerState;
    tenureProgress: number;
    subGoal: SubGoal;
    subGoalProgress: number;
  }

  let { player, tenureProgress, subGoal: _subGoal, subGoalProgress }: Props = $props();

  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
  const avg = (vs: number[]) => vs.length === 0 ? 0 : vs.reduce((s, v) => s + v, 0) / vs.length;

  const w = $derived(player.wellbeing);
  const e = $derived(player.expertise);
  const standing = $derived(player.standing);

  const careerScore    = $derived(clamp(tenureProgress));
  const wellbeingScore = $derived(clamp(avg([100 - w.stress, w.sleep, w.mood, w.physical])));
  const skillScore     = $derived(clamp(avg([e.methods, e.theory, e.writing, e.statistics, e.teaching])));
  const standingScore  = $derived(clamp(avg([standing.reputation, standing.affiliation_prestige, e.politics])));
  const diplomaScore   = $derived(clamp(subGoalProgress));

  const bars = $derived([
    { key: 'career',    abbr: 'CAREER', v: careerScore,    colour: 'var(--career)'    },
    { key: 'wellbeing', abbr: 'WELLBG', v: wellbeingScore, colour: 'var(--wellbeing)' },
    { key: 'skill',     abbr: 'SKILL',  v: skillScore,     colour: 'var(--skill)'     },
    { key: 'standing',  abbr: 'STAND',  v: standingScore,  colour: 'var(--standing)'  },
    { key: 'diploma',   abbr: 'DIPLO',  v: diplomaScore,   colour: 'var(--gold)'      },
  ]);
</script>

<div class="hud-strip five" role="group" aria-label="Career overview">
  {#each bars as b (b.key)}
    <div class="h">
      <div class="hl">
        <span class="nm" style="color: {b.colour}">{b.abbr}</span>
        <span class="pc">{b.v}</span>
      </div>
      <div class="hbar" role="meter" aria-label={b.key} aria-valuenow={b.v} aria-valuemin={0} aria-valuemax={100}>
        <i style="width: {b.v}%; background: {b.colour}"></i>
      </div>
    </div>
  {/each}
</div>
