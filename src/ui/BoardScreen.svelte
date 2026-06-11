<script lang="ts">
  // Campus board screen. The new CampusMap handles the ring board, centre window,
  // and activity list internally. This component bridges the game store props to CampusMap.
  import CampusMap from './CampusMap.svelte';
  import type { LocationId } from '../locations/types';
  import type { ActionCategory } from '../engine/actions';
  import type { BoardActivity } from '../locations/stages';
  import type { CohortEntry } from '../rivals/cohort';
  import type { Flash } from './game.svelte';
  import { rivalPosition } from '../rivals/positions';

  interface Props {
    currentLocation: LocationId;
    focus: string;
    personality: string;
    timeRemaining: number;
    activities: BoardActivity[];
    spent: Record<string, number>;
    day?: number;
    cash?: number;
    rivals?: CohortEntry[];
    target?: LocationId | null;
    overdue?: boolean;
    flash?: Flash | null;
    pipeline?: { drafting: number; submitted: number; published: number } | null;
    onMove?: (id: LocationId) => void;
    onAct?: (activityId: string, category: ActionCategory, points: number) => void;
    onRelax?: () => void;
    onCohort?: () => void;
  }

  let {
    currentLocation,
    focus: _focus,
    personality: _personality,
    timeRemaining,
    activities,
    spent,
    day = 1,
    cash = 0,
    rivals = [],
    target = null,
    overdue = false,
    flash = null,
    pipeline = null,
    onMove,
    onAct,
    onRelax,
    onCohort: _onCohort,
  }: Props = $props();

  // Rivals appear at deterministic spots around the campus each term, so the
  // race is visible on the board itself.
  const rivalTokens = $derived(
    rivals.map((entry, i) => ({
      id: entry.rival_id,
      name: entry.name,
      sprite: 'tok-rival' + (i + 1) as string,
      pos: rivalPosition(entry.rival_id, entry.rank, day),
    }))
  );
</script>

<CampusMap
  selected={currentLocation}
  {timeRemaining}
  {day}
  {cash}
  rivals={rivalTokens}
  {target}
  {overdue}
  {activities}
  {spent}
  {flash}
  {pipeline}
  onSelect={(id) => onMove?.(id)}
  onAct={(actId, cat, pts) => onAct?.(actId, cat, pts)}
  onEndDay={() => onRelax?.()}
/>
