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
import { emptyAllocation, allocationTotal, TURN_TIME_POINTS } from '../engine/actions';
import { runTurn } from '../engine/turn';
import { stageForTurn, totalTurns, type Stage } from '../calendar/stages';
import { loadGame, saveGame, clearSave, hasSave } from '../state/storage';
import { createNewGame } from '../state/newgame';
import { decideTenure, applyTenure } from '../milestones/tenure';
import { loadAllPacks } from '../content/loader';
import { resolveEvents } from '../content/inheritance';
import { selectTurnEvents, type SelectedEvent } from '../engine/events';
import { LOCATIONS, type LocationId } from '../locations/types';
import { scheduleDeadlines } from '../deadlines/deadlines';
import type { Deadline } from '../deadlines/types';

// The resolved content events are static, so load them once.
const ALL_EVENTS = [...resolveEvents(loadAllPacks()).values()];

// Abstract context-switching cost of moving (§3, §4.11). The first move of a
// turn is cheap; each further move costs more, so spreading across many
// locations has a rising opportunity cost without dominating play.
export const MOVE_COST_BASE = 6;
export const MOVE_COST_STEP = 4;

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
  // Movement time spent this turn (not an action category), and how many moves
  // have been made this turn (drives the rising movement cost).
  movementSpent = $state(0);
  movesThisTurn = $state(0);
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

  // Cost of the next move this turn, rising with each move already made.
  get moveCost(): number {
    return MOVE_COST_BASE + MOVE_COST_STEP * this.movesThisTurn;
  }

  get currentLocation(): LocationId {
    return (this.state?.board.current_location ?? 'office') as LocationId;
  }

  // Time points left this turn = budget minus actions committed minus movement.
  get timeRemaining(): number {
    return TURN_TIME_POINTS - allocationTotal(this.allocation) - this.movementSpent;
  }

  // The action categories bound to the current location (§4.11).
  get availableActions(): ActionCategory[] {
    return [...LOCATIONS[this.currentLocation].actions];
  }

  // The pending deadlines, for the pressure board (§4.11a).
  get deadlines(): Deadline[] {
    return ((this.state?.deadlines ?? []) as unknown as Deadline[]).filter(
      (d) => d.status === 'pending',
    );
  }

  // Move to another location, paying the context-switch cost and recording the
  // visit for location memory (§4.11).
  moveTo(id: LocationId): void {
    const current = this.state;
    if (!current) return;
    if (id === current.board.current_location) return;
    const cost = this.moveCost;
    if (this.timeRemaining < cost) return;
    this.movementSpent += cost;
    this.movesThisTurn += 1;
    this.state = {
      ...current,
      board: { ...current.board, current_location: id },
      player: {
        ...current.player,
        location_visits: [
          ...current.player.location_visits,
          { location: id, turn: current.calendar.turn_number },
        ],
      },
    };
  }

  // Spend time on a location-bound action, drawing down the budget.
  act(category: ActionCategory, points: number): void {
    if (!this.availableActions.includes(category)) return;
    const pts = Math.max(0, Math.min(Math.floor(points), this.timeRemaining));
    if (pts === 0) return;
    this.allocation = { ...this.allocation, [category]: this.allocation[category] + pts };
  }

  // Pour the rest of the turn into one action.
  actMax(category: ActionCategory): void {
    this.act(category, this.timeRemaining);
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

  // Start-of-turn: reset the time budget and movement, record the starting
  // location as a visit, then select the turn's events from content by context
  // and present them; if there are none, go straight to the board.
  private beginTurn(): void {
    const current = this.state;
    if (!current) return;
    this.allocation = emptyAllocation();
    this.movementSpent = 0;
    this.movesThisTurn = 0;
    const refreshed: SaveGame = {
      ...current,
      board: { ...current.board, time_remaining: TURN_TIME_POINTS },
      player: {
        ...current.player,
        location_visits: [
          ...current.player.location_visits,
          { location: current.board.current_location, turn: current.calendar.turn_number },
        ],
      },
    };
    this.state = scheduleDeadlines(refreshed);
    const seen = (this.state.events_history as unknown as EventLogEntry[]).map((e) => e.event_id);
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
