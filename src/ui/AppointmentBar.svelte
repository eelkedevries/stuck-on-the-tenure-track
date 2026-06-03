<script lang="ts">
  // Next-appointment countdown (specification §4.11a; prompt 108). Shows the
  // next time-critical commitment on its own clock, separate from full turn
  // time, so the player can see that it can expire while turn time remains.
  import type { Appointment } from '../appointments/appointments';
  import { ALL_LOCATIONS } from '../locations/types';

  interface Props {
    appointment: Appointment;
    elapsed: number;
    atLocation: boolean;
  }

  let { appointment, elapsed, atLocation }: Props = $props();

  const locationName = $derived(
    ALL_LOCATIONS.find((l) => l.id === appointment.location)?.name ?? appointment.location,
  );
  const remaining = $derived(Math.max(0, appointment.at_tp - elapsed));
  const total = $derived(Math.max(1, appointment.at_tp));
  const pct = $derived(Math.max(0, Math.min(100, Math.round((remaining / total) * 100))));
  const urgent = $derived(remaining <= 10);
  const statusText = $derived(
    remaining > 0
      ? `${appointment.title} starts in ${remaining} time`
      : `${appointment.title} is due now`,
  );
  const actionHint = $derived(
    remaining > 0
      ? atLocation
        ? 'Wait here, then spend time on the activity.'
        : 'Travel there before the clock empties.'
      : atLocation
        ? 'Spend time on the highlighted activity now.'
        : 'You are elsewhere; doing anything else will miss it.',
  );
</script>

<section class="appointment" class:urgent aria-label="Deadline countdown">
  <p class="line">
    <span class="label">Deadline clock</span>
    <strong>{statusText}</strong>
  </p>
  <p class="where">
    At the {locationName}. {actionHint}
  </p>
  <div class="bar">
    <span
      class="track"
      role="meter"
      aria-label={statusText}
      aria-valuemin="0"
      aria-valuemax={total}
      aria-valuenow={remaining}
      aria-valuetext={`${remaining} of ${total} time before this commitment expires`}
    >
      <span class="fill" style="width: {pct}%"></span>
    </span>
    <span class="num">{remaining} / {total}t</span>
  </div>
  <p class="warning">This clock is separate from turn time and can run out first.</p>
</section>

<style>
  .appointment {
    border: 2px solid var(--border);
    padding: 0.4rem 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .appointment.urgent {
    border-color: #b00020;
  }
  .line,
  .where,
  .warning {
    margin: 0;
    font-size: 0.9rem;
  }
  .label {
    display: block;
    color: var(--muted);
    text-transform: uppercase;
    font-size: 0.7rem;
    font-weight: bold;
  }
  .where,
  .warning {
    color: var(--muted);
    font-size: 0.8rem;
  }
  .bar {
    display: grid;
    grid-template-columns: 1fr 5rem;
    align-items: center;
    gap: 0.5rem;
  }
  .track {
    height: 0.6rem;
    border: 1px solid var(--border);
    background: var(--surface);
    overflow: hidden;
  }
  .fill {
    display: block;
    height: 100%;
    background: var(--accent);
    transition: width 0.25s ease;
  }
  .urgent .fill {
    background: #b00020;
  }
  .num {
    font-size: 0.75rem;
    text-align: right;
    color: var(--muted);
  }
</style>
