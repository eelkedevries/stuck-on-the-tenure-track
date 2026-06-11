<script lang="ts">
  // App root: drives the playable flow. Orchestration store owns live state;
  // this component renders the correct screen and binds props/callbacks.
  import Shell from './ui/Shell.svelte';
  import SpriteSheets from './ui/SpriteSheets.svelte';
  import Sprite from './ui/Sprite.svelte';
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
  import { formatMoney } from './economy/economy';
  import { ordinal } from './rivals/race';
  import { LOCATION_META } from './ui/locationMeta';
  import type { Stage } from './calendar/stages';

  const game = new Game();

  const STAGE_LABEL: Record<Stage, string> = {
    undergraduate: "Bachelor's student",
    msc: "Master's student",
    phd: 'PhD student',
    postdoc: 'Postdoc',
    assistant_professor: 'Assistant professor',
  };

  // 5-tab navigation for the turn view
  type Tab = 'board' | 'location' | 'cohort' | 'diary' | 'help';
  let activeTab = $state<Tab>('board');

  const HELP_ITEMS = [
    { icon: 'ui-hourglass', vb: '0 0 24 24', title: 'Term time',    body: 'Each term gives you 100 time points. Travelling between buildings and doing activities both spend them. The clock on the board fills red as time runs down; when it is full, the term ends.' },
    { icon: 'ui-coin',      vb: '0 0 24 24', title: 'Money',        body: 'Cash is shown at the top. Each term your loan, stipend or salary lands and the rent goes out. Bar shifts, tutoring and invigilating top it up; pints, gym sessions and conference fees drain it. Going overdrawn hurts.' },
    { icon: 'ui-clock',     vb: '0 0 24 24', title: 'Deadlines',    body: 'Some appointments run on their own clock, shown above the board. They can run out before your term time does — mind the colour: green ahead, amber soon, red now.' },
    { icon: 'ui-flag',      vb: '0 0 24 24', title: 'The four tracks', body: 'Career, Wellbeing, Skill and Standing summarise how you are doing. Activities push them up or down — keep an eye on Wellbeing.' },
    { icon: 'tok-rival1',   vb: '0 0 16 16', title: 'The race',     body: 'Three rivals race you to tenure. Their tokens roam the board, the strip above the board shows the standings, and the Cohort tab has the full table. First to tenure wins.' },
    { icon: 'ui-cap',       vb: '0 0 24 24', title: 'Diploma & stages', body: "The Diploma bar tracks progress through the current stage: Bachelor's, Master's, PhD, postdoc, assistant professor, tenure." },
  ];
</script>

<!-- Global sprite sheet (hidden) -->
<SpriteSheets />

{#if game.view === 'turn' && game.state}
  <!-- ── Game console layout ──────────────────────────────────────────── -->
  {@const cohortEntries = cohortTracker(game.rivals)}
  {@const headline = rivalHeadline(cohortEntries, game.state.calendar.turn_number)}
  {@const locMeta = LOCATION_META[game.currentLocation] ?? { name: game.currentLocation, blurb: '' }}
  {@const standings = game.standings}

  <div class="console" role="main" aria-label="Campus board">
    <!-- Slim dark header -->
    <div class="c-head">
      <div class="mt">
        <b>Stuck on the Tenure Track</b>
        {#if headline}<span style="color: var(--amber); font-size: 9px; margin-left: 4px">{headline}</span>{/if}
      </div>
      <div class="c-right">
        <span class="c-cash" class:broke={game.cash < 0}>
          <Sprite id="ui-coin" size={13} />
          {formatMoney(game.cash)}
        </span>
        <div class="c-stage">
          <Sprite id="ui-cap" size={14} />
          {STAGE_LABEL[game.stage]}
        </div>
      </div>
    </div>

    <!-- HUD strip: 5 progression bars -->
    <StatusBars
      player={game.state.player}
      tenureProgress={game.tenureProgress}
      subGoal={game.subGoal}
      subGoalProgress={game.subGoalProgress}
    />

    <!-- Cohort race strip: the standings, one tap from the full table -->
    <button class="race-strip" onclick={() => { activeTab = 'cohort'; }} aria-label="Cohort race standings — open cohort tab">
      <span class="race-flag"><Sprite id="ui-flag" size={13} /></span>
      <span class="race-entries">
        {#each standings as s, i (s.id)}
          <span class="race-entry" class:you={s.isPlayer}>
            <b>{ordinal(s.position)}</b>
            <Sprite
              id={s.isPlayer ? 'tok-player' : 'tok-rival' + (cohortEntries.findIndex(e => e.rival_id === s.id) + 1)}
              size={14}
              vb="0 0 16 16"
            />
            {s.isPlayer ? 'You' : s.name}
          </span>
          {#if i < standings.length - 1}<span class="race-sep">·</span>{/if}
        {/each}
      </span>
      <span class="race-line">{game.raceLine}</span>
    </button>

    <!-- Main content area -->
    <div class="c-main">
      {#if activeTab === 'board'}
        <!-- Appointment strip: the next one due, or the one just missed -->
        {#if game.nextAppointment}
          <AppointmentBar
            appointment={game.nextAppointment}
            elapsed={game.elapsed}
            atLocation={game.nextAppointment.location === game.currentLocation}
          />
        {:else if game.lastMissedAppointment}
          <AppointmentBar
            appointment={game.lastMissedAppointment}
            elapsed={game.elapsed}
            atLocation={false}
            missed
          />
        {/if}
        <!-- Board fills remaining space -->
        <div class="c-board">
          <BoardScreen
            currentLocation={game.currentLocation}
            focus={game.currentFocus}
            personality={game.currentPersonality}
            timeRemaining={game.timeRemaining}
            activities={game.activities}
            spent={game.activitySpent}
            day={game.state.calendar.turn_number + 1}
            cash={game.cash}
            flash={game.flash}
            pipeline={game.pipeline}
            rivals={cohortEntries}
            onMove={(id) => game.moveTo(id)}
            onAct={(activityId, category, points) => game.act(activityId, category, points)}
            onRelax={() => game.relax()}
            onCohort={() => { activeTab = 'cohort'; }}
          />
        </div>

      {:else if activeTab === 'location'}
        <div class="c-main scroll">
          <div class="tabpane">
            <div class="loc-hero">
              <svg class="loc-hero-img" viewBox="0 0 128 64" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <use href={'#int-' + (game.currentLocation === 'gym_outdoors' ? 'gym' : game.currentLocation)} />
              </svg>
              <span class="loc-hero-badge">
                <Sprite
                  id={'ext-' + (game.currentLocation === 'gym_outdoors' ? 'gym' : game.currentLocation)}
                  size={26}
                  vb="0 0 32 32"
                />
              </span>
            </div>

            <div class="panel">
              <div class="panel-body">
                <h3 class="loc-title">{locMeta.name}</h3>
                <p class="loc-blurb">{locMeta.blurb}</p>
              </div>
            </div>

            <div class="panel">
              <div class="panel-head">
                <h3 class="game-title">What you can do here</h3>
                <span class="eyebrow">{game.activities.length} action{game.activities.length !== 1 ? 's' : ''}</span>
              </div>
              <div class="panel-body">
                <div class="loc-acts">
                  {#each game.activities as act (act.id)}
                    <div class="loc-act">
                      <div class="loc-act-top">
                        <b>{act.label}</b>
                        <span class="mono">
                          {#if act.cash !== 0}
                            <span class="a-cash" class:earn={act.cash > 0} class:spend={act.cash < 0}>
                              {act.cash > 0 ? '+' : ''}{formatMoney(act.cash)}
                            </span>
                          {/if}
                          {act.timeCost}t
                        </span>
                      </div>
                      <div class="effects" style="margin-top: 6px">
                        {#each act.positiveEffects as e}
                          <span class="eff up">▲ {e}</span>
                        {/each}
                        {#each act.negativeEffects as e}
                          <span class="eff down">▼ {e}</span>
                        {/each}
                      </div>
                      {#if act.flavour}
                        <p class="loc-act-fl">{act.flavour}</p>
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>
            </div>

            <div class="panel">
              <div class="panel-head">
                <h3 class="game-title">This term</h3>
              </div>
              <div class="panel-body">
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
              </div>
            </div>

            {#if game.deadlines.length > 0}
              <div class="panel">
                <div class="panel-head">
                  <h3 class="game-title">Deadlines</h3>
                </div>
                <div class="panel-body">
                  <DeadlineBoard
                    deadlines={game.deadlines}
                    currentDate={game.state.calendar.current_date}
                  />
                </div>
              </div>
            {/if}
          </div>
        </div>

      {:else if activeTab === 'cohort'}
        <div class="c-main scroll">
          <CohortScreen entries={cohortEntries} {standings} playerRank={STAGE_LABEL[game.stage]} />
        </div>

      {:else if activeTab === 'diary'}
        <div class="c-main scroll">
          <div class="tabpane">
            <div class="panel">
              <div class="panel-head">
                <h3 class="game-title">Diary — term {game.state.calendar.turn_number + 1}</h3>
                <span class="eyebrow">In progress</span>
              </div>
              <div class="panel-body">
                <p class="diary-empty">Your diary recap will appear here after the term ends. Tap the clock on the board to end the term.</p>
                <div class="term-line" style="margin-top: 12px">
                  <span class="eyebrow">This term's goal</span>
                  {game.subGoal.title}.
                </div>
                <div class="diploma" style="margin-top: 12px">
                  <Sprite id="ui-cap" cls="seal" size={44} />
                  <span class="txt">
                    <b>{game.subGoal.title}</b>
                    <small>{game.subGoalProgress}% of this stage goal.</small>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      {:else if activeTab === 'help'}
        <div class="c-main scroll">
          <div class="tabpane">
            <div class="panel">
              <div class="panel-head">
                <h3 class="game-title">How to play</h3>
                <span class="chip">Reference</span>
              </div>
              <div class="panel-body">
                <div class="help-list">
                  {#each HELP_ITEMS as item}
                    <div class="help-item">
                      <span class="help-ic">
                        <Sprite id={item.icon} size={22} vb={item.vb} />
                      </span>
                      <div>
                        <b>{item.title}</b>
                        <p>{item.body}</p>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            </div>
            <div class="panel">
              <div class="panel-body">
                <p class="diary-empty">A full rules-and-glossary section will live here — controls, scoring, every activity and its effects, and the path to tenure.</p>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <!-- 5-tab bottom bar -->
    <div class="tabbar five" role="tablist" aria-label="Game tabs">
      <button
        role="tab"
        aria-selected={activeTab === 'board'}
        onclick={() => { activeTab = 'board'; }}
      >
        <span class="tab-ico"><Sprite id="ui-hourglass" size={19} /></span>
        Board
      </button>
      <button
        role="tab"
        aria-selected={activeTab === 'location'}
        onclick={() => { activeTab = 'location'; }}
      >
        <span class="tab-ico"><Sprite id="ui-pin" size={19} /></span>
        Location
      </button>
      <button
        role="tab"
        aria-selected={activeTab === 'cohort'}
        onclick={() => { activeTab = 'cohort'; }}
      >
        <span class="tab-ico"><Sprite id="tok-player" size={19} vb="0 0 16 16" /></span>
        Cohort
      </button>
      <button
        role="tab"
        aria-selected={activeTab === 'diary'}
        onclick={() => { activeTab = 'diary'; }}
      >
        <span class="tab-ico"><Sprite id="ui-flag" size={19} /></span>
        Diary
      </button>
      <button
        role="tab"
        aria-selected={activeTab === 'help'}
        onclick={() => { activeTab = 'help'; }}
      >
        <span class="tab-ico"><Sprite id="ui-help" size={19} /></span>
        Help
      </button>
    </div>
  </div>

{:else if game.view === 'recap' && game.recap}
  <!-- ── End-of-turn recap ──────────────────────────────────────────────── -->
  <div class="console">
    <div class="c-head">
      <div class="mt"><b>Stuck on the Tenure Track</b></div>
      <div class="c-stage">
        <Sprite id="ui-flag" size={14} />
        Term recap
      </div>
    </div>
    <DiaryScreen recap={game.recap} onContinue={() => game.continueFromRecap()} />
  </div>

{:else}
  <!-- ── Non-turn views ────────────────────────────────────────────────── -->
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
{/if}

<!-- Detailed standing (debug / accessibility) -->
{#if game.view === 'turn' && game.state}
  <details class="standing-debug" style="display:none">
    <summary>Your standing (the numbers)</summary>
    <TurnScreen calendar={game.state.calendar} stage={game.stage} player={game.state.player} />
  </details>
{/if}

<style>
  :global(html), :global(body), :global(#app) {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  :global(#app) {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    overflow: hidden;
  }
  .console {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }
  .hint {
    margin: 0 0 0.5rem;
    color: var(--muted);
    font-size: 0.9rem;
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
