<script lang="ts">
  // Jones-style ring board with centre activity window, clock dial,
  // and walk animation. The centre window plays the location interior like a
  // Jones storefront: scene, resident character with a line of patter, then
  // the menu of things to do (with prices). Acting pops a feedback toast.
  import { COORDS, travelCost } from '../locations/board';
  import { ALL_LOCATIONS, type LocationId } from '../locations/types';
  import type { ActionCategory } from '../engine/actions';
  import type { BoardActivity } from '../locations/stages';
  import { NPCS, npcLine } from './npcs';
  import { formatMoney } from '../economy/economy';
  import { LOCATION_META } from './locationMeta';
  import type { Flash } from './game.svelte';
  import Sprite from './Sprite.svelte';

  interface RivalToken { id: string; name: string; sprite: string; pos: LocationId }
  interface Pipeline { drafting: number; submitted: number; published: number }

  interface Props {
    selected?: LocationId | null;
    timeRemaining: number;
    day?: number;
    cash?: number;
    rivals?: RivalToken[];
    target?: LocationId | null;
    overdue?: boolean;
    activities?: BoardActivity[];
    spent?: Record<string, number>;
    flash?: Flash | null;
    pipeline?: Pipeline | null;
    onSelect?: (id: LocationId) => void;
    onAct?: (activityId: string, category: ActionCategory, points: number) => void;
    onEndDay?: () => void;
  }

  let {
    selected = null,
    timeRemaining,
    day = 1,
    cash = 0,
    rivals = [],
    target = null,
    overdue = false,
    activities = [],
    spent = {},
    flash = null,
    pipeline = null,
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

  // Visits this session, for rotating the character's patter on re-entry.
  let visitTick = $state(0);

  // Feedback toast, driven by the store's flash channel (action results,
  // campus moments, gamble outcomes).
  interface Toast { id: number; text: string; tone: Flash['tone'] }
  let toast = $state<Toast | null>(null);
  let toastTimer: ReturnType<typeof setTimeout> | undefined;

  $effect(() => {
    const f = flash;
    if (!f) return;
    toast = { id: f.seq, text: f.text, tone: f.tone };
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast = null; }, 2800);
  });

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
    clearTimeout(toastTimer);
    toast = null;
    walkTo = id;
    walking = true;
    onSelect?.(id);
    setTimeout(() => {
      walking = false;
      walkTo = null;
      visitTick += 1;
      view = 'location';
    }, 950);
  }

  function handleClockClick() {
    if (walking) return;
    view = view === 'clock' ? 'location' : 'clock';
  }

  function handleAct(act: BoardActivity) {
    onAct?.(act.id, act.category, act.timeCost);
  }

  // A rival in the room earns a line of needle, rotating with the term.
  const TAUNTS = [
    '“How is the writing going?” they ask, terribly kindly.',
    '“I had a really productive term,” they say, unprompted.',
    'They mention their supervisor replied within the hour. Twice.',
    '“You look tired,” they say, radiating eight hours of sleep.',
  ];

  // Sprite / display helpers
  function extId(locId: LocationId): string {
    if (locId === 'gym_outdoors') return 'ext-gym';
    return 'ext-' + locId;
  }
  function intId(locId: LocationId): string {
    if (locId === 'gym_outdoors') return 'int-gym';
    return 'int-' + locId;
  }

  const PARK_IDS = new Set<LocationId>(['park_west', 'park_east']);

  const meta = $derived(LOCATION_META[current]);
  const [accentBg, accentFg] = $derived(meta.accent);

  const npc = $derived(NPCS[current]);
  const patter = $derived(npcLine(current, day, visitTick));
  const rivalsHere = $derived(rivals.filter((r) => r.pos === current));

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
          <!-- End-of-term panel -->
          <div class="plaque" style="background: var(--danger)">
            <Sprite id="ui-clock" size={20} />
            <span style="color: #fff">Term clock</span>
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
                The term is spent. Time to write the diary and move on.
              {:else}
                You have {timeRemaining} time points left this term. End it whenever you like — unused time becomes rest.
              {/if}
            </p>
            <div class="endday-actions">
              <button class="btn btn-primary" onclick={() => onEndDay?.()}>End the term ▸</button>
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
            {#if toast}
              {#key toast.id}
                <div class="act-toast" class:good={toast.tone === 'good'} class:bad={toast.tone === 'bad'} role="status">
                  {toast.text}
                </div>
              {/key}
            {/if}
          </div>
          <div class="npc-row">
            <span class="npc-face">
              <Sprite id={npc.sprite} size={46} vb="0 0 24 24" />
            </span>
            <div class="npc-bubble">
              <b class="npc-name">{npc.name} <small>· {npc.role}</small></b>
              <p class="npc-line">{patter}</p>
              {#if rivalsHere.length > 0}
                <p class="rival-note">
                  {#each rivalsHere as rv (rv.id)}
                    <Sprite id={rv.sprite} cls="rival-mini" size={14} vb="0 0 16 16" />
                  {/each}
                  {rivalsHere.map((r) => r.name).join(' and ')}
                  {rivalsHere.length === 1 ? 'is' : 'are'} here.
                  {TAUNTS[(day + rivalsHere[0].name.length) % TAUNTS.length]}
                </p>
              {/if}
            </div>
          </div>
          {#if pipeline && (current === 'office' || current === 'lab' || current === 'library')}
            <div class="pipeline" aria-label="Paper pipeline">
              <span class="pl-t">Papers</span>
              <span class="pl-chip">{pipeline.drafting} drafting</span>
              <span class="pl-chip">{pipeline.submitted} in review</span>
              <span class="pl-chip done">{pipeline.published} published</span>
            </div>
          {/if}
          <div class="acts-in">
            {#if activities.length > 0}
              {#each activities as act (act.id)}
                {@const affordable = act.cash >= 0 || cash + act.cash >= 0}
                {@const can = act.timeCost <= timeRemaining && affordable}
                <button
                  class="arow"
                  disabled={!can}
                  onclick={() => can && handleAct(act)}
                  title={!affordable ? 'You cannot afford this right now.' : act.flavour}
                >
                  <span class="a-main">
                    <span class="an">
                      {act.label}
                      {#if act.badge}<span class="a-badge">{act.badge}</span>{/if}
                    </span>
                    <span class="ah">{!affordable ? 'Not enough cash' : act.effectHint}</span>
                  </span>
                  {#if act.gamble}
                    <span class="a-odds">{Math.round(act.gamble.odds * 100)}%</span>
                  {/if}
                  {#if act.cash !== 0}
                    <span class="a-cash" class:earn={act.cash > 0} class:spend={act.cash < 0}>
                      {act.cash > 0 ? '+' : ''}{formatMoney(act.cash)}
                    </span>
                  {/if}
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
      {@const [signBg, signFg] = LOCATION_META[location.id].accent}
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
        <span class="b-sign" style="background: {signBg}; color: {signFg}">
          {LOCATION_META[location.id]?.name ?? location.name}
        </span>
        <span class="b-art">
          <Sprite id={extId(location.id)} cls="b-ico" size={34} vb="0 0 32 32" />
        </span>
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
        aria-label="Term clock — {timeRemaining} time left. {view === 'clock' ? 'Close end-of-term.' : 'Open end-of-term.'}"
      >
        <div class="dial" style="--deg: {spent_deg}deg">
          <div class="dial-hand"></div>
          <div class="dial-pin"></div>
          <div class="dial-face">
            <span class="dial-t">{Math.max(0, timeRemaining)}</span>
            <span class="dial-u">left</span>
          </div>
        </div>
        <span class="c-day">TERM {day}</span>
      </button>
    </div>

    <!-- Deco tree at (0,1) → gridColumn 1, gridRow 2 -->
    <div style="grid-column: 1 / 2; grid-row: 2 / 3" class="deco-cell">
      <Sprite id="deco-tree" size={40} vb="0 0 32 32" cls="deco-ico" />
    </div>
  </div>
</div>
