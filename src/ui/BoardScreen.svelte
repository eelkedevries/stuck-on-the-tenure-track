<script lang="ts">
  // Campus board screen. The new CampusMap handles the ring board, centre window,
  // and activity list internally. This component bridges the game store props to CampusMap.
  import CampusMap from './CampusMap.svelte';
  import type { LocationId } from '../locations/types';
  import type { ActionCategory } from '../engine/actions';
  import type { BoardActivity } from '../locations/stages';
  import type { CohortEntry } from '../rivals/cohort';

  interface Props {
    currentLocation: LocationId;
    focus: string;
    personality: string;
    timeRemaining: number;
    activities: BoardActivity[];
    spent: Record<string, number>;
    day?: number;
    rivals?: CohortEntry[];
    target?: LocationId | null;
    overdue?: boolean;
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
    rivals = [],
    target = null,
    overdue = false,
    onMove,
    onAct,
    onRelax,
    onCohort: _onCohort,
  }: Props = $props();

  // Map cohort entries to rival tokens for the board
  const rivalTokens = $derived(
    rivals.map((entry, i) => ({
      id: entry.rival_id,
      name: entry.name,
      sprite: 'tok-rival' + (i + 1) as string,
      pos: currentLocation, // rivals don't have board positions in the current model — placeholder
    }))
  );
</script>

<CampusMap
  selected={currentLocation}
  {timeRemaining}
  {day}
  rivals={rivalTokens}
  {target}
  {overdue}
  {activities}
  {spent}
  onSelect={(id) => onMove?.(id)}
  onAct={(actId, cat, pts) => onAct?.(actId, cat, pts)}
  onEndDay={() => onRelax?.()}
/>
