<script lang="ts">
  // Next-appointment bar (specification §4.11a; prompt 091). Shows the upcoming
  // commitment, where it is, and how much turn-time remains before it, as a bar.
  // Presentational.
  import type { Appointment } from '../appointments/appointments';
  import { ALL_LOCATIONS } from '../locations/types';
  import { TURN_TIME_POINTS } from '../engine/actions';

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
  const pct = $derived(Math.max(0, Math.min(100, (elapsed / appointment.at_tp) * 100)));
  const urgent = $derived(remaining <= TURN_TIME_POINTS * 0.15);
</script>

<section class="appointment" class:urgent aria-label="Next appointment">
  <p class="line">
    <strong>{appointment.title}</strong> — at the {locationName}
    {#if atLocation}<span class="ok">· activity available here</span>{/if}
  </p>
  <div class="bar">
    <span class="track"><span class="fill" style="width: {pct}%"></span></span>
    <span class="num">{remaining}t left</span>
  </div>
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
  .line {
    margin: 0;
    font-size: 0.9rem;
  }
  .ok {
    color: #4a8;
    font-weight: bold;
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
