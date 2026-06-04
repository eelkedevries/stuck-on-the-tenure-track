<script lang="ts">
  // Advisory term objective panel — compact GOAL/PRESSURE/FOCUS dl.
  import type { Appointment } from '../appointments/appointments';
  import { urgencyFor } from '../deadlines/deadlines';
  import type { Deadline, DeadlineType, Urgency } from '../deadlines/types';
  import type { Allocation } from '../engine/actions';
  import type { Stage } from '../calendar/stages';
  import { ALL_LOCATIONS, type LocationId } from '../locations/types';
  import type { SubGoal } from '../milestones/subgoals';
  import type { SavePlayer } from '../state/save';

  interface Props {
    player: SavePlayer;
    stage: Stage;
    subGoal: SubGoal;
    deadlines: Deadline[];
    currentDate: string;
    appointment: Appointment | null;
    elapsed: number;
    currentLocation: LocationId;
    allocation: Allocation;
  }

  let {
    player,
    stage,
    subGoal,
    deadlines,
    currentDate,
    appointment,
    elapsed,
    currentLocation,
    allocation,
  }: Props = $props();

  const URGENCY_ORDER: Urgency[] = ['overdue', 'due_now', 'soon', 'later'];
  const URGENCY_LABEL: Record<Urgency, string> = {
    overdue: 'overdue',
    due_now: 'due now',
    soon: 'soon',
    later: 'later',
  };
  const DEADLINE_LOCATION: Record<DeadlineType, LocationId> = {
    grant_call: 'funder_portal',
    milestone: 'office',
    teaching_prep: 'classroom',
  };

  function locationName(id: LocationId): string {
    return ALL_LOCATIONS.find((location) => location.id === id)?.name ?? id;
  }

  function firstCriterionBehind(goal: SubGoal): string | null {
    return goal.criteria.find((criterion) => criterion.current < criterion.target)?.label ?? null;
  }

  const urgentDeadline = $derived(
    deadlines
      .map((deadline) => ({ deadline, urgency: urgencyFor(deadline, currentDate) }))
      .sort((a, b) => URGENCY_ORDER.indexOf(a.urgency) - URGENCY_ORDER.indexOf(b.urgency))[0] ?? null,
  );

  const appointmentPressure = $derived(
    appointment
      ? {
          label: `${appointment.title} at ${locationName(appointment.location)} (${Math.max(0, appointment.at_tp - elapsed)}t left)`,
          urgent: Math.max(0, appointment.at_tp - elapsed) <= 15,
          location: appointment.location,
        }
      : null,
  );

  const deadlinePressure = $derived(
    urgentDeadline
      ? {
          label: `${urgentDeadline.deadline.title} ${URGENCY_LABEL[urgentDeadline.urgency]}`,
          urgency: urgentDeadline.urgency,
          location: DEADLINE_LOCATION[urgentDeadline.deadline.type],
        }
      : null,
  );

  const pressure = $derived(
    appointmentPressure?.urgent
      ? appointmentPressure.label
      : deadlinePressure
        ? deadlinePressure.label
        : appointmentPressure
          ? appointmentPressure.label
          : 'No deadline or appointment queued.',
  );

  const focus = $derived.by(() => {
    if (player.wellbeing.stress >= 70) return 'Recover before more work degrades everything.';
    if (appointmentPressure?.urgent && appointmentPressure.location !== currentLocation)
      return `Go to ${locationName(appointmentPressure.location)}.`;
    if (deadlinePressure && deadlinePressure.urgency !== 'later' && deadlinePressure.location !== currentLocation)
      return `Go to ${locationName(deadlinePressure.location)}.`;
    const researchCareerStage = stage === 'phd' || stage === 'postdoc' || stage === 'assistant_professor';
    if (researchCareerStage && allocation.research === 0) return 'Put time into research output.';
    const standingScore = Math.round(
      (player.standing.reputation + player.standing.affiliation_prestige + player.expertise.politics) / 3,
    );
    if (standingScore < 30) return 'Be visible: network or do useful service.';
    const weakCriterion = firstCriterionBehind(subGoal);
    if (weakCriterion) return `Advance ${weakCriterion.toLowerCase()}.`;
    return 'Bank progress without creating a new crisis.';
  });
</script>

<div class="panel term" aria-label="This term">
  <div class="panel-head">
    <h3 class="game-title">This term</h3>
    <span class="eyebrow">Advisory</span>
  </div>
  <div class="panel-body">
    <dl>
      <div>
        <dt>Goal</dt>
        <dd>{subGoal.title}.</dd>
      </div>
      <div>
        <dt>Pressure</dt>
        <dd>{pressure}</dd>
      </div>
      <div>
        <dt>Focus</dt>
        <dd>{focus}</dd>
      </div>
    </dl>
  </div>
</div>

<style>
  dl {
    margin: 0;
    display: grid;
    gap: 0.4rem;
  }
  dl > div {
    display: grid;
    grid-template-columns: 4.5rem 1fr;
    gap: 0.5rem;
  }
  dt {
    font-family: var(--mono);
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--muted);
    padding-top: 2px;
  }
  dd {
    margin: 0;
    line-height: 1.35;
    font-size: 13px;
  }
  @media (max-width: 32rem) {
    dl > div {
      grid-template-columns: 1fr;
      gap: 0.1rem;
    }
  }
</style>
