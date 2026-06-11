<script lang="ts">
  // Appointment countdown strip — thin bar above the board.
  import type { Appointment } from '../appointments/appointments';
  import { locationName as displayName } from './locationMeta';
  import Sprite from './Sprite.svelte';

  interface Props {
    appointment: Appointment;
    elapsed: number;
    atLocation: boolean;
    missed?: boolean;
  }

  let { appointment, elapsed, atLocation: _atLocation, missed = false }: Props = $props();

  const locationName = $derived(displayName(appointment.location));
  const remaining = $derived(Math.max(0, appointment.at_tp - elapsed));
  const total     = $derived(Math.max(1, appointment.at_tp));
  const pct       = $derived(missed ? 100 : Math.max(0, Math.min(100, Math.round((remaining / total) * 100))));
  const cls       = $derived(missed || remaining <= 0 ? 'overdue' : remaining <= 10 ? '' : 'safe');
  const fill      = $derived(missed || remaining <= 0 ? 'var(--danger)' : remaining <= 10 ? 'var(--amber)' : 'var(--ok)');
  const word      = $derived(missed ? 'MISSED' : remaining <= 0 ? 'NOW' : remaining <= 10 ? 'SOON' : 'AHEAD');
</script>

<div class={'appt-strip ' + cls} role="region" aria-label="Appointment countdown">
  <Sprite id="ui-clock" size={16} />
  <span class="at">{appointment.title} · {locationName} · {word}</span>
  <span class="ab"><i style="width: {pct}%; background: {fill}"></i></span>
  <span class="av">{Math.max(0, remaining)}t</span>
</div>
