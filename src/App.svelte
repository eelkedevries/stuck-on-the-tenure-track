<script lang="ts">
  // App root: drives the playable flow (prompt 073). The orchestration store
  // (`./ui/game.svelte`) owns the live state; this component renders the
  // existing presentational screens for the current view and binds their props
  // and callbacks to the store. The event flow (EventScreen) is wired by a
  // later prompt.
  import Shell from './ui/Shell.svelte';
  import SaveLoadControls from './ui/SaveLoadControls.svelte';
  import IntroScreen from './ui/IntroScreen.svelte';
  import EventScreen from './ui/EventScreen.svelte';
  import TurnScreen from './ui/TurnScreen.svelte';
  import BoardScreen from './ui/BoardScreen.svelte';
  import StatusBars from './ui/StatusBars.svelte';
  import AppointmentBar from './ui/AppointmentBar.svelte';
  import DeadlineBoard from './ui/DeadlineBoard.svelte';
  import ThisTermPanel from './ui/ThisTermPanel.svelte';
  import DiaryScreen from './ui/DiaryScreen.svelte';
  import CohortScreen from './ui/CohortScreen.svelte';
  import CvScreen from './ui/CvScreen.svelte';
  import { cohortTracker } from './rivals/cohort';
  import { rivalHeadline } from './rivals/headline';
  import { buildCv } from './ui/cv';
  import { Game } from './ui/game.svelte';
  import type { Stage } from './calendar/stages';

  const game = new Game();

  const STAGE_LABEL: Record<Stage, string> = {
    undergraduate: "Bachelor's student",
    msc: "Master's student",
    phd: 'PhD student',
    postdoc: 'Postdoc',
    assistant_professor: 'Assistant professor',
  };
</script>

<Shell>
  {#if game.view === 'start'}
    <p>
      You are starting a career in psychology. Allocate your time each turn and try to
      reach tenure before your luck — or your sleep — runs out.
    </p>
    <SaveLoadControls
      hasSave={game.hasSave}
      onNewGame={() => game.newGame()}
      onResume={() => game.resume()}
      onReset={() => game.reset()}
    />
  {:else if game.view === 'intro'}
    <IntroScreen onBegin={() => game.beginGame()} />
  {:else if game.view === 'event' && game.state}
    <p class="hint">Things have happened. Read each one and choose how to respond.</p>
    <EventScreen
      events={game.pendingEvents}
      canContinue={game.allEventsResolved}
      onChoose={(id, i) => game.resolveEvent(id, i)}
      onContinue={() => game.continueEvents()}
    />
  {:else if game.view === 'turn' && game.state}
    <p class="objective">🎓 Be the first of your cohort to win tenure.</p>
    {@const headline = rivalHeadline(cohortTracker(game.rivals), game.state.calendar.turn_number)}
    {#if headline}
      <p class="rival-headline">{headline}</p>
    {/if}
    <p class="situation">{STAGE_LABEL[game.stage]} · {game.state.calendar.current_date}</p>
    <p class="hint">Move around campus and spend your time; the day ends when your time runs out.</p>
    <ThisTermPanel
      player={game.state.player}
      stage={game.stage}
      subGoal={game.subGoal}
      deadlines={game.deadlines}
      currentDate={game.state.calendar.current_date}
      appointment={game.nextAppointment}
      elapsed={game.elapsed}
      currentLocation={game.currentLocation}
      allocation={game.allocation}
    />
    <StatusBars
      player={game.state.player}
      tenureProgress={game.tenureProgress}
      subGoal={game.subGoal}
      subGoalProgress={game.subGoalProgress}
    />
    {#if game.nextAppointment}
      <AppointmentBar
        appointment={game.nextAppointment}
        elapsed={game.elapsed}
        atLocation={game.nextAppointment.location === game.currentLocation}
      />
    {/if}
    <DeadlineBoard deadlines={game.deadlines} currentDate={game.state.calendar.current_date} />
    <BoardScreen
      currentLocation={game.currentLocation}
      focus={game.currentFocus}
      timeRemaining={game.timeRemaining}
      activities={game.activities}
      spent={game.allocation}
      onMove={(id) => game.moveTo(id)}
      onAct={(category, points) => game.act(category, points)}
      onRelax={() => game.relax()}
      onCohort={() => game.showCohort()}
    />
    <details class="standing">
      <summary>Your standing (the numbers)</summary>
      <TurnScreen calendar={game.state.calendar} stage={game.stage} player={game.state.player} />
    </details>
  {:else if game.view === 'recap' && game.recap}
    <DiaryScreen recap={game.recap} onContinue={() => game.continueFromRecap()} />
  {:else if game.view === 'cohort' && game.state}
    <CohortScreen entries={cohortTracker(game.rivals)} />
    <nav class="actions" aria-label="Cohort actions">
      <button type="button" onclick={() => game.showTurn()}>Back</button>
    </nav>
  {:else if game.view === 'end' && game.state}
    <CvScreen cv={buildCv(game.state)} />
    <nav class="actions" aria-label="End actions">
      <button type="button" class="primary" onclick={() => game.reset()}>New game</button>
    </nav>
  {/if}
</Shell>

<style>
  .objective {
    margin: 0 0 0.1rem;
    font-weight: bold;
  }
  .rival-headline {
    margin: 0 0 0.25rem;
    border-left: 3px solid var(--accent);
    padding-left: 0.5rem;
    color: var(--muted);
    font-size: 0.9rem;
  }
  .situation {
    margin: 0 0 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-size: 0.8rem;
    color: var(--muted);
  }
  .hint {
    margin: 0 0 0.5rem;
    color: var(--muted);
    font-size: 0.9rem;
  }
  .standing {
    margin-top: 0.75rem;
    border-top: 2px solid var(--border);
    padding-top: 0.5rem;
  }
  .standing summary {
    cursor: pointer;
    color: var(--muted);
    font-size: 0.85rem;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }
  .actions button {
    font-family: inherit;
    padding: 0.5rem 1rem;
    border: 2px solid var(--border);
    background: var(--surface);
    color: var(--text);
    cursor: pointer;
  }
  .actions button.primary {
    background: var(--accent);
    color: var(--accent-text);
  }
</style>
