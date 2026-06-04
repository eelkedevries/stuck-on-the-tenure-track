<script lang="ts">
  // Jones-style ring board with centre activity window, clock dial,
  // and walk animation. Ported from prototype.app.jsx.
  import { COORDS, travelCost } from '../locations/board';
  import { ALL_LOCATIONS, type LocationId } from '../locations/types';
  import type { ActionCategory } from '../engine/actions';
  import type { BoardActivity } from '../locations/stages';
  import Sprite from './Sprite.svelte';

  interface RivalToken { id: string; name: string; sprite: string; pos: LocationId }

  interface Props {
    selected?: LocationId | null;
    timeRemaining: number;
    day?: number;
    rivals?: RivalToken[];
    target?: LocationId | null;
    overdue?: boolean;
    activities?: BoardActivity[];
    spent?: Record<string, number>;
    onSelect?: (id: LocationId) => void;
    onAct?: (activityId: string, category: ActionCategory, points: number) => void;
    onEndDay?: () => void;
  }

  let {
    selected = null,
    timeRemaining,
    day = 1,
    rivals = [],
    target = null,
    overdue = false,
    activities = [],
    spent = {},
    onSelect,
    onAct,
    onEndDay,
  }: Props = $props();

  // local view state
  type View = 'location' | 'clock';
  let view = $state<View>('location');
  let walking = $state(false);
  let walkTo = $state<LocationId | null>(null);

  const current = $derived((selected ?? 'office') as LocationId);

  // When time runs out, switch to clock view
  $effect(() => {
    if (timeRemaining <= 0 && view !== 'clock') view = 'clock';
  });

  function handleBuildingClick(id: LocationId) {
    if (walking) return;
    if (id === current) {
      view = 'location';
      return;
    }
    const cost = travelCost(current, id);
    if (cost > timeRemaining) return;
    walkTo = id;
    walking = true;
    onSelect?.(id);
    setTimeout(() => {
      walking = false;
      walkTo = null;
      view = 'location';
    }, 950);
  }

  function handleClockClick() {
    if (walking) return;
    view = view === 'clock' ? 'location' : 'clock';
  }

  // Sprite / display helpers
  function extId(locId: LocationId): string {
    if (locId === 'gym_outdoors') return 'ext-gym';
    return 'ext-' + locId;
  }
  function intId(locId: LocationId): string {
    if (locId === 'gym_outdoors') return 'int-gym';
    return 'int-' + locId;
  }

  // Location metadata
  interface LocMeta { name: string; blurb: string; accent: [string, string] }
  const LOCATION_META: Record<LocationId, LocMeta> = {
    home:             { name: 'Student room',     blurb: 'Your single room: a bed, a desk, and the quiet hum of impostor syndrome.',                     accent: ['var(--wellbeing)', '#fff'] },
    upscale_home:     { name: 'Apartment',         blurb: 'A real flat — the reward for surviving the early stages.',                                       accent: ['var(--wellbeing)', '#fff'] },
    office:           { name: 'Office',            blurb: 'Shared, draughty, the engine room of a career.',                                                 accent: ['var(--gold)', '#1a1a1a'] },
    lab:              { name: 'Lab',               blurb: 'Benches, beakers and the faint smell of progress.',                                              accent: ['var(--green)', '#fff'] },
    library:          { name: 'Library',           blurb: 'Silence, stacks and strong coffee.',                                                             accent: ['var(--green)', '#fff'] },
    classroom:        { name: 'Lecture hall',      blurb: 'Where you teach — and are quietly judged.',                                                      accent: ['var(--skill)', '#fff'] },
    seminar_room:     { name: 'Seminar room',      blurb: 'Round-table country.',                                                                           accent: ['var(--standing)', '#fff'] },
    cafe_pub:         { name: 'Café / pub',        blurb: 'Caffeine and gossip, the true currencies of academia.',                                          accent: ['var(--standing)', '#fff'] },
    conference_venue: { name: 'Conference',        blurb: 'Lanyards, name-dropping and the occasional genuinely good idea.',                                accent: ['var(--skill)', '#fff'] },
    funder_portal:    { name: 'Funder portal',     blurb: 'Ninety pages so a panel can say "not this round".',                                             accent: ['var(--gold)', '#1a1a1a'] },
    gym_outdoors:     { name: 'Gym',               blurb: 'Your body, briefly remembered.',                                                                 accent: ['var(--wellbeing)', '#fff'] },
    health_centre:    { name: 'Health centre',     blurb: 'The GP will tell you to rest.',                                                                   accent: ['var(--danger)', '#fff'] },
    park_west:        { name: 'Campus green',      blurb: 'Green space. Pigeons, a bench, and ten honest minutes.',                                         accent: ['var(--green-d)', '#fff'] },
    park_east:        { name: 'Riverside walk',    blurb: 'The river path. Ducks, reeds, and a rare clear thought.',                                        accent: ['var(--green-d)', '#fff'] },
  };

  const PARK_IDS = new Set<LocationId>(['park_west', 'park_east']);

  const meta = $derived(LOCATION_META[current]);
  const [accentBg, accentFg] = $derived(meta.accent);

  const spent_deg = $derived(Math.max(0, Math.min(100, 100 - timeRemaining)) * 3.6);
  const clockFull = $derived(timeRemaining <= 0);

  const destName = $derived(
    walkTo ? (LOCATION_META[walkTo]?.name ?? walkTo) : meta.name
  );
</script>

<div class="campus">
  <div class="campus-grid">
    <!-- Centre window -->
    <div class="centre-cell">
      <div class="centre">
        {#if walking}
          <!-- Walk animation -->
          <div class="plaque" style="background: var(--ink)">
            <span style="color: #fff">On the move…</span>
          </div>
          <div class="walkscene">
            <svg class="walk-bg" viewBox="0 0 128 64" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <use href="#int-walk" />
            </svg>
            <div class="walker">
              <svg class="wf wf1" viewBox="0 0 16 16" aria-hidden="true"><use href="#tok-player" /></svg>
              <svg class="wf wf2" viewBox="0 0 16 16" aria-hidden="true"><use href="#tok-player" /></svg>
            </div>
            <div class="walk-label">Walking to {destName}…</div>
          </div>
        {:else if view === 'clock'}
          <!-- End-of-day panel -->
          <div class="plaque" style="background: var(--danger)">
            <Sprite id="ui-clock" size={20} />
            <span style="color: #fff">Day clock</span>
          </div>
          <div class="endday">
            <div class={'big-dial' + (clockFull ? ' done' : '')} style="--deg: {spent_deg}deg">
              <div class="big-hand"></div>
              <div class="big-pin"></div>
              <div class="big-face">
                <b>{Math.max(0, timeRemaining)}</b>
                <small>t left</small>
              </div>
            </div>
            <p class="endday-copy">
              {#if clockFull}
                The day is spent. Time to sleep on it.
              {:else}
                You have {timeRemaining} time points left today. End the day whenever you like — unused time is lost.
              {/if}
            </p>
            <div class="endday-actions">
              <button class="btn btn-primary" onclick={() => onEndDay?.()}>End the day ▸</button>
              {#if !clockFull}
                <button class="btn" onclick={() => { view = 'location'; }}>Not yet</button>
              {/if}
            </div>
          </div>
        {:else}
          <!-- Location view -->
          <div class="plaque" style="background: {accentBg}">
            <Sprite id={extId(current)} size={20} vb="0 0 32 32" />
            <span style="color: {accentFg}">{meta.name}</span>
            <span class="p-t" style="color: {accentFg}">{timeRemaining}t</span>
          </div>
          <div class="scene">
            <svg class="scene-img" viewBox="0 0 128 64" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <use href={'#' + intId(current)} />
            </svg>
          </div>
          <div class="acts-in">
            {#if activities.length > 0}
              {#each activities as act (act.id)}
                {@const can = act.timeCost <= timeRemaining}
                <button
                  class="arow"
                  disabled={!can}
                  onclick={() => can && onAct?.(act.id, act.category, act.timeCost)}
                  title={act.flavour}
                >
                  <span class="an">{act.label}</span>
                  <span class="ae">
                    {#each act.positiveEffects as _e, _i}
                      <span class="sq up" title="▲ {_e}"></span>
                    {/each}
                    {#each act.negativeEffects as _e, _i}
                      <span class="sq down" title="▼ {_e}"></span>
                    {/each}
                  </span>
                  <span class="ac">{act.timeCost}t</span>
                </button>
              {/each}
            {:else}
              <p class="diary-empty" style="padding: 8px 2px">Nothing to do here.</p>
            {/if}
          </div>
        {/if}
      </div>
    </div>

    <!-- Building tiles around the ring -->
    {#each ALL_LOCATIONS as location (location.id)}
      {@const pos = COORDS[location.id]}
      {@const here = location.id === current}
      {@const cost = travelCost(current, location.id)}
      {@const reach = here || cost <= timeRemaining}
      {@const onit = rivals.filter(r => r.pos === location.id)}
      {@const isPark = PARK_IDS.has(location.id)}
      {@const isTarget = target === location.id}
      <button
        style="grid-column: {pos.x + 1} / {pos.x + 2}; grid-row: {pos.y + 1} / {pos.y + 2}"
        class="bldg"
        class:here
        class:unreachable={!reach && !here}
        class:target={isTarget}
        class:overdue={overdue && isTarget}
        class:park={isPark}
        disabled={!reach && !here}
        aria-label="{location.name}{here ? ' — you are here' : ', ' + cost + 't to travel'}"
        aria-pressed={here}
        onclick={() => handleBuildingClick(location.id)}
      >
        <span class="b-art">
          <Sprite id={extId(location.id)} cls="b-ico" size={34} vb="0 0 32 32" />
        </span>
        <span class="b-name">{LOCATION_META[location.id]?.name ?? location.name}</span>
        <span class="b-cost">{here ? 'HERE' : '·' + cost + 't'}</span>
        {#if here || onit.length > 0}
          <span class="token-layer">
            {#if here}
              <Sprite id="tok-player" cls="token player" size={20} vb="0 0 16 16" />
            {/if}
            {#each onit as rv (rv.id)}
              <Sprite id={rv.sprite} cls="token" size={20} vb="0 0 16 16" />
            {/each}
          </span>
        {/if}
      </button>
    {/each}

    <!-- Clock at (2,4) → gridColumn 3, gridRow 5 -->
    <div style="grid-column: 3 / 4; grid-row: 5 / 6">
      <button
        class="clock-cell"
        class:active={view === 'clock'}
        class:done={clockFull}
        onclick={handleClockClick}
        aria-label="Day clock — {timeRemaining} time left. {view === 'clock' ? 'Close end-of-day.' : 'Open end-of-day.'}"
      >
        <div class="dial" style="--deg: {spent_deg}deg">
          <div class="dial-hand"></div>
          <div class="dial-pin"></div>
          <div class="dial-face">
            <span class="dial-t">{Math.max(0, timeRemaining)}</span>
            <span class="dial-u">left</span>
          </div>
        </div>
        <span class="c-day">DAY {day}</span>
      </button>
    </div>

    <!-- Deco tree at (0,1) → gridColumn 1, gridRow 2 -->
    <div style="grid-column: 1 / 2; grid-row: 2 / 3" class="deco-cell">
      <Sprite id="deco-tree" size={40} vb="0 0 32 32" cls="deco-ico" />
    </div>
  </div>
</div>
