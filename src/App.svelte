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

  // Location info for the Location tab (derived from current location)
  const LOCATION_META: Record<string, { name: string; blurb: string }> = {
    home:             { name: 'Student room',    blurb: 'Your single room: a bed, a desk, and the quiet hum of impostor syndrome.' },
    upscale_home:     { name: 'Apartment',        blurb: 'A real flat — the reward for surviving the early stages.' },
    office:           { name: 'Office',           blurb: 'Shared, draughty, the engine room of a career.' },
    lab:              { name: 'Lab',              blurb: 'Benches, beakers and the faint smell of progress.' },
    library:          { name: 'Library',          blurb: 'Silence, stacks and strong coffee.' },
    classroom:        { name: 'Lecture hall',     blurb: 'Where you teach — and are quietly judged.' },
    seminar_room:     { name: 'Seminar room',     blurb: 'Round-table country.' },
    cafe_pub:         { name: 'Café / pub',       blurb: 'Caffeine and gossip, the true currencies of academia.' },
    conference_venue: { name: 'Conference',       blurb: 'Lanyards, name-dropping and the occasional genuinely good idea.' },
    funder_portal:    { name: 'Funder portal',    blurb: 'Ninety pages so a panel can say "not this round".' },
    gym_outdoors:     { name: 'Gym',              blurb: 'Your body, briefly remembered.' },
    health_centre:    { name: 'Health centre',    blurb: 'The GP will tell you to rest.' },
    park_west:        { name: 'Campus green',     blurb: 'Green space. Pigeons, a bench, and ten honest minutes.' },
    park_east:        { name: 'Riverside walk',   blurb: 'The river path. Ducks, reeds, and a rare clear thought.' },
  };

  const HELP_ITEMS = [
    { icon: 'ui-hourglass', vb: '0 0 24 24', title: 'Turn time',    body: 'Each day gives you 100 time points. Travelling between buildings and doing activities both spend them. The clock on the board fills red as time runs down; when it is full, the day ends.' },
    { icon: 'ui-clock',     vb: '0 0 24 24', title: 'Deadlines',    body: 'Some appointments run on their own clock, shown above the board. They can run out before your turn time does — mind the colour: green ahead, amber soon, red now.' },
    { icon: 'ui-flag',      vb: '0 0 24 24', title: 'The four tracks', body: 'Career, Wellbeing, Skill and Standing summarise how you are doing. Activities push them up or down — keep an eye on Wellbeing.' },
    { icon: 'tok-rival1',   vb: '0 0 16 16', title: 'Your cohort',  body: 'Four rivals race you towards tenure. See where they stand on the board and on the Cohort tab.' },
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

  <div class="console" role="main" aria-label="Campus board">
    <!-- Slim dark header -->
    <div class="c-head">
      <div class="mt">
        <b>Stuck on the Tenure Track</b>
        {#if headline}<span style="color: var(--amber); font-size: 9px; margin-left: 4px">{headline}</span>{/if}
      </div>
      <div class="c-stage">
        <Sprite id="ui-cap" size={14} />
        {STAGE_LABEL[game.stage]}
      </div>
    </div>

    <!-- HUD strip: 5 progression bars -->
    <StatusBars
      player={game.state.player}
      tenureProgress={game.tenureProgress}
      subGoal={game.subGoal}
      subGoalProgress={game.subGoalProgress}
    />

    <!-- Main content area -->
    <div class="c-main">
      {#if activeTab === 'board'}
        <!-- Appointment strip if active -->
        {#if game.nextAppointment}
          <AppointmentBar
            appointment={game.nextAppointment}
            elapsed={game.elapsed}
            atLocation={game.nextAppointment.location === game.currentLocation}
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
            day={game.state.calendar.turn_number}
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
                        <span class="mono">{act.timeCost}t</span>
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
          <CohortScreen entries={cohortEntries} />
        </div>

      {:else if activeTab === 'diary'}
        <div class="c-main scroll">
          <div class="tabpane">
            <div class="panel">
              <div class="panel-head">
                <h3 class="game-title">Diary — day {game.state.calendar.turn_number}</h3>
                <span class="eyebrow">In progress</span>
              </div>
              <div class="panel-body">
                <p class="diary-empty">Your diary recap will appear here after the day ends. Tap the clock on the board to end the day.</p>
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
        Day recap
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
