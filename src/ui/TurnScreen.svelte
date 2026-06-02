<script lang="ts">
  // Turn screen (specification §5, §4.1, §3): shows the calendar, career stage,
  // and the player's resources for the current turn. The event screen (`056`)
  // and action allocation (`057`) are separate. Presentational only.
  import type { Calendar } from '../state/save';
  import type { PlayerState } from '../state/types';
  import type { Stage } from '../calendar/stages';

  interface Props {
    calendar: Calendar;
    stage: Stage;
    player: PlayerState;
  }

  let { calendar, stage, player }: Props = $props();

  const STAGE_LABELS: Record<Stage, string> = {
    undergraduate: "Bachelor's",
    msc: "Master's",
    phd: 'PhD',
    postdoc: 'Postdoc',
    assistant_professor: 'Assistant professor',
  };
</script>

<section class="turn-screen" aria-label="Current turn">
  <header class="turn-header">
    <p class="stat"><span class="label">Stage</span> <span class="value">{STAGE_LABELS[stage]}</span></p>
    <p class="stat"><span class="label">Turn</span> <span class="value">{calendar.turn_number}</span></p>
    <p class="stat"><span class="label">Date</span> <span class="value">{calendar.current_date}</span></p>
  </header>

  <h2>Resources</h2>
  <dl class="resources">
    <dt>Funds (personal / research)</dt>
    <dd>{player.funds.personal} / {player.funds.research}</dd>
    <dt>Wellbeing (sleep / mood / physical)</dt>
    <dd>{player.wellbeing.sleep} / {player.wellbeing.mood} / {player.wellbeing.physical}</dd>
    <dt>Reputation</dt>
    <dd>{player.standing.reputation}</dd>
    <dt>Affiliation prestige</dt>
    <dd>{player.standing.affiliation_prestige}</dd>
    <dt>Expertise (methods / theory / writing / statistics / teaching / politics)</dt>
    <dd>
      {player.expertise.methods} / {player.expertise.theory} / {player.expertise.writing} /
      {player.expertise.statistics} / {player.expertise.teaching} / {player.expertise.politics}
    </dd>
  </dl>
</section>

<style>
  .turn-screen {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .turn-header {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--border);
  }
  .stat {
    display: flex;
    gap: 0.5rem;
  }
  .label {
    color: var(--muted);
    text-transform: uppercase;
    font-size: 0.75rem;
    align-self: center;
  }
  .value {
    font-weight: bold;
  }
  .resources {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.25rem 1rem;
    margin: 0;
  }
  .resources dt {
    color: var(--muted);
    font-size: 0.85rem;
  }
  .resources dd {
    margin: 0 0 0.5rem;
    font-weight: bold;
  }
  @media (min-width: 32rem) {
    .resources {
      grid-template-columns: 2fr 1fr;
      align-items: baseline;
    }
    .resources dd {
      margin-bottom: 0;
    }
  }
</style>
