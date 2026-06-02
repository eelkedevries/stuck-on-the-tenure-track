// App-state orchestration store (specification §4.2, §5; prompt 073).
//
// Holds the live game and drives the playable flow, binding the existing
// presentational screens to the engine. The save schema's `rivals` array is the
// single source of truth for the cohort, so a saved game restores it on resume.
// This store adds no gameplay: it sequences screens and calls existing engine
// functions (runTurn, the tenure decision) only.

import type { SaveGame } from '../state/save';
import type { Rival } from '../rivals/simulation';
import type { ActionCategory, Allocation } from '../engine/actions';
import { emptyAllocation } from '../engine/actions';
import { runTurn } from '../engine/turn';
import { stageForTurn, totalTurns, type Stage } from '../calendar/stages';
import { loadGame, saveGame, clearSave, hasSave } from '../state/storage';
import { createNewGame } from '../state/newgame';
import { decideTenure, applyTenure } from '../milestones/tenure';
import { loadAllPacks } from '../content/loader';
import { resolveEvents } from '../content/inheritance';
import { selectTurnEvents, type SelectedEvent } from '../engine/events';

// The resolved content events are static, so load them once.
const ALL_EVENTS = [...resolveEvents(loadAllPacks()).values()];

export type View = 'start' | 'event' | 'turn' | 'allocate' | 'cohort' | 'end';

interface EventLogEntry {
  event_id: string;
  turn: number;
  date: string;
}

export class Game {
  state = $state<SaveGame | null>(null);
  allocation = $state<Allocation>(emptyAllocation());
  view = $state<View>('start');
  pendingEvents = $state<SelectedEvent[]>([]);
  private lastCategories: ActionCategory[] = [];

  get hasSave(): boolean {
    return hasSave();
  }

  get rivals(): Rival[] {
    return (this.state?.rivals ?? []) as unknown as Rival[];
  }

  // The career stage is derived from the turn number, so the displayed stage
  // advances undergraduate → … → assistant professor across the game.
  get stage(): Stage {
    return stageForTurn(this.state?.calendar.turn_number ?? 0);
  }

  newGame(): void {
    const { state } = createNewGame();
    saveGame(state);
    this.state = state;
    this.allocation = emptyAllocation();
    this.lastCategories = [];
    this.beginTurn();
  }

  resume(): void {
    const loaded = loadGame();
    if (!loaded) return;
    this.state = loaded;
    this.allocation = emptyAllocation();
    this.lastCategories = [];
    if (this.isOver(loaded)) this.view = 'end';
    else this.beginTurn();
  }

  // Start-of-turn: select the turn's events from content by context and present
  // them; if there are none, go straight to the board.
  private beginTurn(): void {
    const current = this.state;
    if (!current) return;
    const seen = (current.events_history as unknown as EventLogEntry[]).map((e) => e.event_id);
    this.pendingEvents = selectTurnEvents(ALL_EVENTS, {
      stage: this.stage,
      recentCategories: this.lastCategories,
      seenEventIds: seen,
    });
    this.view = this.pendingEvents.length > 0 ? 'event' : 'turn';
  }

  // Resolve (acknowledge/engage) one presented event: record it in the history
  // and advance to the board once all are handled.
  resolveEvent(eventId: string): void {
    const current = this.state;
    if (!current) return;
    const entry: EventLogEntry = {
      event_id: eventId,
      turn: current.calendar.turn_number,
      date: current.calendar.current_date,
    };
    this.state = {
      ...current,
      events_history: [
        ...(current.events_history as unknown as EventLogEntry[]),
        entry,
      ] as unknown as SaveGame['events_history'],
    };
    this.pendingEvents = this.pendingEvents.filter((e) => e.event.event_id !== eventId);
    if (this.pendingEvents.length === 0) this.view = 'turn';
  }

  reset(): void {
    clearSave();
    this.state = null;
    this.allocation = emptyAllocation();
    this.view = 'start';
  }

  showTurn(): void {
    if (this.state) this.view = 'turn';
  }

  showAllocate(): void {
    if (this.state) this.view = 'allocate';
  }

  showCohort(): void {
    if (this.state) this.view = 'cohort';
  }

  // Mirror the controlled allocation screen: store the raw value and let the
  // screen surface over-budget state and gate its commit button.
  setAllocation(category: ActionCategory, points: number): void {
    const value = Number.isFinite(points) ? Math.max(0, Math.floor(points)) : 0;
    this.allocation = { ...this.allocation, [category]: value };
  }

  // Commit the turn: run the full turn loop (advancing the calendar, resolving
  // actions, and simulating rivals), persist, and either continue or, on the
  // final budgeted turn, run the tenure decision and end the game.
  commit(): void {
    const current = this.state;
    if (!current) return;

    // Remember which categories the player leaned into, to bias next turn's
    // events towards what they were doing.
    const committed = this.allocation;
    this.lastCategories = (Object.keys(committed) as ActionCategory[]).filter(
      (c) => committed[c] > 0,
    );

    let advanced: Rival[] = this.rivals;
    const next = runTurn(current, this.stage, {
      allocation: this.allocation,
      rivals: this.rivals,
      onRivals: (r) => {
        advanced = r;
      },
    });
    let merged: SaveGame = { ...next, rivals: advanced as unknown as SaveGame['rivals'] };

    if (merged.calendar.turn_number >= totalTurns()) {
      const decision = decideTenure(merged);
      if (decision.offered) merged = applyTenure(merged);
      this.finish(merged);
      return;
    }

    this.state = merged;
    saveGame(merged);
    this.allocation = emptyAllocation();
    this.beginTurn();
  }

  private finish(state: SaveGame): void {
    this.state = state;
    saveGame(state);
    this.allocation = emptyAllocation();
    this.view = 'end';
  }

  private isOver(state: SaveGame): boolean {
    return state.player.standing.rank === 'tenured' || state.calendar.turn_number >= totalTurns();
  }
}
