<script lang="ts">
  // App root: drives the playable flow (prompt 073). The orchestration store
  // (`./ui/game.svelte`) owns the live state; this component renders the
  // existing presentational screens for the current view and binds their props
  // and callbacks to the store. The event flow (EventScreen) is wired by a
  // later prompt.
  import Shell from './ui/Shell.svelte';
  import SaveLoadControls from './ui/SaveLoadControls.svelte';
  import EventScreen from './ui/EventScreen.svelte';
  import TurnScreen from './ui/TurnScreen.svelte';
  import ActionAllocationScreen from './ui/ActionAllocationScreen.svelte';
  import CohortScreen from './ui/CohortScreen.svelte';
  import CvScreen from './ui/CvScreen.svelte';
  import { cohortTracker } from './rivals/cohort';
  import { buildCv } from './ui/cv';
  import { Game } from './ui/game.svelte';

  const game = new Game();
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
  {:else if game.view === 'event' && game.state}
    <EventScreen events={game.pendingEvents} onResolve={(id) => game.resolveEvent(id)} />
  {:else if game.view === 'turn' && game.state}
    <TurnScreen calendar={game.state.calendar} stage={game.stage} player={game.state.player} />
    <nav class="actions" aria-label="Turn actions">
      <button type="button" class="primary" onclick={() => game.showAllocate()}>Plan this turn</button>
      <button type="button" onclick={() => game.showCohort()}>Cohort</button>
    </nav>
  {:else if game.view === 'allocate' && game.state}
    <ActionAllocationScreen
      allocation={game.allocation}
      onAllocate={(category, points) => game.setAllocation(category, points)}
      onCommit={() => game.commit()}
    />
    <nav class="actions" aria-label="Allocation actions">
      <button type="button" onclick={() => game.showTurn()}>Back</button>
    </nav>
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
