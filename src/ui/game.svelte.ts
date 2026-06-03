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
import { subGoalFor, subGoalProgress, type SubGoal } from '../milestones/subgoals';
import { loadGame, saveGame, clearSave, hasSave } from '../state/storage';
import { createNewGame } from '../state/newgame';
import { decideTenure, applyTenure, tenureScore, TENURE_THRESHOLD } from '../milestones/tenure';
import { loadAllPacks } from '../content/loader';
import { resolveEvents } from '../content/inheritance';
import { selectTurnEvents, eventPoolFor, applyEventEffects, type SelectedEvent } from '../engine/events';
import { type LocationId } from '../locations/types';
import { travelCost } from '../locations/board';
import {
  focusAtStage,
  personalityAtStage,
  activitiesAtStage,
  type BoardActivity,
} from '../locations/stages';
import { scheduleDeadlines, urgencyFor } from '../deadlines/deadlines';
import type { Deadline } from '../deadlines/types';
import { buildRecap, type Recap } from './recap';
import { rivalSighting } from '../rivals/sightings';
import type { LocationVisit } from '../state/save';
import { scheduleAppointments, type Appointment } from '../appointments/appointments';

// Content packs are static, so load them once; the per-player event pool is
// derived from them by sub-discipline at the start of each turn.
const ALL_PACKS = loadAllPacks();
const EVENT_TITLE = new Map([...resolveEvents(ALL_PACKS).values()].map((e) => [e.event_id, e.title]));

function appointmentCategory(type: Appointment['type']): ActionCategory {
  switch (type) {
    case 'grant_interview':
      return 'funding';
    case 'meeting':
      return 'networking';
    case 'lecture':
    case 'exam':
      return 'research';
  }
}

function appointmentBadge(type: Appointment['type']): string {
  switch (type) {
    case 'lecture':
      return 'Lecture due now';
    case 'exam':
      return 'Exam due now';
    case 'grant_interview':
      return 'Interview due now';
    case 'meeting':
      return 'Meeting due now';
  }
}

function appointmentWaitLabel(type: Appointment['type']): string {
  switch (type) {
    case 'lecture':
      return 'Wait until lecture starts';
    case 'exam':
      return 'Wait for exam';
    case 'grant_interview':
      return 'Wait for grant interview';
    case 'meeting':
      return 'Wait until meeting starts';
  }
}

function appointmentWaitBadge(type: Appointment['type']): string {
  switch (type) {
    case 'lecture':
      return 'Lecture soon';
    case 'exam':
      return 'Exam soon';
    case 'grant_interview':
      return 'Interview soon';
    case 'meeting':
      return 'Meeting soon';
  }
}

function deadlineLink(type: Deadline['type']): {
  location: LocationId;
  category: ActionCategory;
  timeCost: number;
  effectHint: string;
  positiveEffects: string[];
  negativeEffects: string[];
} | null {
  switch (type) {
    case 'grant_call':
      return {
        location: 'funder_portal',
        category: 'funding',
        timeCost: 30,
        effectHint: 'Push the grant call before it closes',
        positiveEffects: ['Grant chance +', 'Career +'],
        negativeEffects: ['Stress +', 'Time −'],
      };
    case 'teaching_prep':
      return {
        location: 'classroom',
        category: 'teaching',
        timeCost: 25,
        effectHint: 'Prepare teaching before the deadline',
        positiveEffects: ['Teaching +', 'Standing +'],
        negativeEffects: ['Stress +', 'Time −'],
      };
    case 'milestone':
      return {
        location: 'seminar_room',
        category: 'research',
        timeCost: 30,
        effectHint: 'Make a focused push towards this career milestone',
        positiveEffects: ['Career +', 'Skill +'],
        negativeEffects: ['Stress +', 'Sleep −'],
      };
    default:
      return null;
  }
}

export type View = 'start' | 'intro' | 'event' | 'turn' | 'recap' | 'allocate' | 'cohort' | 'end';

interface EventLogEntry {
  event_id: string;
  turn: number;
  date: string;
}

export type ActivitySpent = Record<string, number>;

export class Game {
  state = $state<SaveGame | null>(null);
  allocation = $state<Allocation>(emptyAllocation());
  view = $state<View>('start');
  pendingEvents = $state<SelectedEvent[]>([]);
  recap = $state<Recap | null>(null);
  appointments = $state<Appointment[]>([]);
  activitySpent = $state<ActivitySpent>({});
  // Waiting and travel spend turn time without resolving as a productivity category.
  waitingSpent = $state(0);
  // Travel time spent this turn (not an action category).
  movementSpent = $state(0);
  private lastCategories: ActionCategory[] = [];
  private pendingEnd = false;

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

  // Time cost to travel from the current location to another, by board distance.
  travelCost(id: LocationId): number {
    return travelCost(this.currentLocation, id);
  }

  // Time-points elapsed in the current turn.
  get elapsed(): number {
    return TURN_TIME_POINTS - this.timeRemaining;
  }

  // The next appointment still to come this turn (for the time-remaining bar).
  get nextAppointment(): Appointment | null {
    return (
      this.appointments
        .filter((a) => a.status === 'pending')
        .sort((a, b) => a.at_tp - b.at_tp)[0] ?? null
    );
  }

  // Resolve appointments whose time has passed without the player explicitly
  // spending time on the linked activity. Being in the right room is a prompt,
  // not automatic attendance.
  private resolveAppointments(): void {
    const cur = this.state;
    if (!cur) return;
    const elapsed = this.elapsed;
    let s = cur;
    this.appointments = this.appointments.map((a) => {
      if (a.status !== 'pending' || a.at_tp >= elapsed) return a;
      s = applyEventEffects(s, { reputation: -2, stress: 10 });
      return { ...a, status: 'missed' as const };
    });
    this.state = s;
  }

  private attendAppointment(activityId: string, elapsedAtStart: number): void {
    const cur = this.state;
    if (!cur || !activityId.startsWith('appointment:')) return;
    const appointmentId = activityId.slice('appointment:'.length);
    let s = cur;
    this.appointments = this.appointments.map((a) => {
      if (a.appointment_id !== appointmentId || a.status !== 'pending') return a;
      if (a.location !== cur.board.current_location || elapsedAtStart < a.at_tp) return a;
      s = applyEventEffects(s, { reputation: 1, mood: 1 });
      return { ...a, status: 'attended' as const };
    });
    this.state = s;
  }

  // The current stage's concrete sub-goal (a checklist of criteria) and its
  // overall completion.
  get subGoal(): SubGoal {
    if (!this.state) return { title: '', criteria: [] };
    return subGoalFor(this.state);
  }

  get subGoalProgress(): number {
    return subGoalProgress(this.subGoal);
  }

  // Progress toward tenure (0..100%), the player's headline progression bar.
  get tenureProgress(): number {
    if (!this.state) return 0;
    return Math.max(0, Math.min(100, Math.round((tenureScore(this.state) / TENURE_THRESHOLD) * 100)));
  }

  get currentLocation(): LocationId {
    return (this.state?.board.current_location ?? 'office') as LocationId;
  }

  // Time points left this turn = budget minus actions committed, waiting, and movement.
  get timeRemaining(): number {
    return TURN_TIME_POINTS - allocationTotal(this.allocation) - this.waitingSpent - this.movementSpent;
  }

  // The named activities available at the current location for the current
  // stage (§4.11, §3). The board shows these; each maps to an internal category.
  get activities(): BoardActivity[] {
    const routine = activitiesAtStage(this.stage, this.currentLocation);
    return [
      ...this.appointmentWaitActivities(),
      ...this.appointmentActivities(),
      ...this.deadlineActivities(),
      ...routine,
    ];
  }

  // The underlying action categories available here (used to validate spending).
  get availableActions(): ActionCategory[] {
    return [...new Set(this.activities.map((a) => a.category))];
  }

  private appointmentWaitActivities(): BoardActivity[] {
    return this.appointments
      .filter((a) => a.status === 'pending' && a.location === this.currentLocation)
      .filter((a) => this.elapsed < a.at_tp)
      .map((a) => {
        const wait = Math.max(0, Math.min(a.at_tp - this.elapsed, this.timeRemaining));
        return {
          id: `wait:appointment:${a.appointment_id}`,
          label: appointmentWaitLabel(a.type),
          category: 'personal' as const,
          timeCost: wait,
          effectHint: `Let ${wait}t pass so the timed activity becomes available`,
          flavour: 'Waiting only advances the clock; you still need to spend time on the actual activity afterwards.',
          positiveEffects: ['Ready on time'],
          negativeEffects: ['Time −'],
          badge: appointmentWaitBadge(a.type),
        };
      })
      .filter((a) => a.timeCost > 0);
  }

  private appointmentActivities(): BoardActivity[] {
    return this.appointments
      .filter(
        (a) =>
          a.status === 'pending' && a.location === this.currentLocation && this.elapsed >= a.at_tp,
      )
      .map((a) => {
        const category = appointmentCategory(a.type);
        return {
          id: `appointment:${a.appointment_id}`,
          label: a.title,
          category,
          timeCost: Math.min(20, Math.max(10, this.timeRemaining)),
          effectHint: 'Attend this timed commitment before its bar empties',
          flavour: 'Being here is not enough — spend time on this to count it.',
          positiveEffects: ['Attendance +', 'Standing +'],
          negativeEffects: ['Time −', 'Stress if missed'],
          badge: appointmentBadge(a.type),
        };
      });
  }

  private deadlineActivities(): BoardActivity[] {
    const currentDate = this.state?.calendar.current_date;
    if (!currentDate) return [];
    return this.deadlines
      .filter((d) => {
        const linked = deadlineLink(d.type);
        if (!linked || linked.location !== this.currentLocation) return false;
        return urgencyFor(d, currentDate) === 'due_now' || urgencyFor(d, currentDate) === 'overdue';
      })
      .map((d) => {
        const linked = deadlineLink(d.type);
        if (!linked) throw new Error('Deadline link disappeared');
        return {
          id: `deadline:${d.deadline_id}`,
          label: d.title,
          category: linked.category,
          timeCost: linked.timeCost,
          effectHint: linked.effectHint,
          flavour: 'Spend time on this before the turn resolves, or it may count as missed.',
          positiveEffects: linked.positiveEffects,
          negativeEffects: linked.negativeEffects,
          badge: 'Deadline activity',
        };
      });
  }

  // A short, stage-specific description of what this location is for now.
  get currentFocus(): string {
    return focusAtStage(this.stage, this.currentLocation);
  }

  // A concise personality line for the current place, keeping the board lively
  // without changing actions or effects.
  get currentPersonality(): string {
    return personalityAtStage(this.stage, this.currentLocation);
  }

  // The pending deadlines, for the pressure board (§4.11a).
  get deadlines(): Deadline[] {
    return ((this.state?.deadlines ?? []) as unknown as Deadline[]).filter(
      (d) => d.status === 'pending',
    );
  }

  private waitForAppointment(activityId: string): boolean {
    if (!activityId.startsWith('wait:appointment:')) return false;
    const appointmentId = activityId.slice('wait:appointment:'.length);
    const appointment = this.appointments.find(
      (a) =>
        a.appointment_id === appointmentId &&
        a.status === 'pending' &&
        a.location === this.currentLocation,
    );
    if (!appointment) return true;
    const wait = Math.max(0, Math.min(appointment.at_tp - this.elapsed, this.timeRemaining));
    if (wait <= 0) return true;
    this.waitingSpent += wait;
    this.activitySpent = {
      ...this.activitySpent,
      [activityId]: (this.activitySpent[activityId] ?? 0) + wait,
    };
    this.resolveAppointments();
    this.endIfTimeUp();
    return true;
  }

  // Move to another location, paying the context-switch cost and recording the
  // visit for location memory (§4.11).
  moveTo(id: LocationId): void {
    const current = this.state;
    if (!current) return;
    if (id === current.board.current_location) return;
    const cost = travelCost(current.board.current_location as LocationId, id);
    if (this.timeRemaining < cost) return;
    this.movementSpent += cost;
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
    this.resolveAppointments();
    this.endIfTimeUp();
  }

  // Spend time on a visible location activity, drawing down the budget while
  // tracking the selected card separately from the internal category.
  act(activityId: string, category: ActionCategory, points: number): void {
    if (this.waitForAppointment(activityId)) return;
    if (!this.availableActions.includes(category)) return;
    const elapsedAtStart = this.elapsed;
    const pts = Math.max(0, Math.min(Math.floor(points), this.timeRemaining));
    if (pts === 0) return;
    this.allocation = { ...this.allocation, [category]: this.allocation[category] + pts };
    this.activitySpent = {
      ...this.activitySpent,
      [activityId]: (this.activitySpent[activityId] ?? 0) + pts,
    };
    this.attendAppointment(activityId, elapsedAtStart);
    this.resolveAppointments();
    this.endIfTimeUp();
  }

  // Pour the rest of the turn into one action.
  actMax(activityId: string, category: ActionCategory): void {
    this.act(activityId, category, this.timeRemaining);
  }

  // Let the rest of the day pass as rest, ending the turn. This is how a turn
  // ends when time remains — there is no "end turn" button.
  relax(): void {
    if (!this.state) return;
    const rest = this.timeRemaining;
    if (rest > 0) {
      this.allocation = { ...this.allocation, personal: this.allocation.personal + rest };
    }
    // The day is over; resolve any appointments still outstanding.
    this.resolveAppointments();
    this.commit();
  }

  // The turn ends automatically once its clock is spent.
  private endIfTimeUp(): void {
    if (this.state && this.timeRemaining <= 0) this.commit();
  }

  newGame(): void {
    const { state } = createNewGame();
    saveGame(state);
    this.state = state;
    this.allocation = emptyAllocation();
    this.activitySpent = {};
    this.waitingSpent = 0;
    this.movementSpent = 0;
    this.lastCategories = [];
    // Show the intro/onboarding before the first turn.
    this.view = 'intro';
  }

  // Leave the intro and start the first turn.
  beginGame(): void {
    if (this.state) this.beginTurn();
  }

  resume(): void {
    const loaded = loadGame();
    if (!loaded) return;
    this.state = loaded;
    this.allocation = emptyAllocation();
    this.activitySpent = {};
    this.waitingSpent = 0;
    this.movementSpent = 0;
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
    this.activitySpent = {};
    this.waitingSpent = 0;
    this.movementSpent = 0;
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
    this.appointments = scheduleAppointments(this.stage, current.calendar.turn_number);
    const pool = eventPoolFor(ALL_PACKS, current.player.specialisation.current_sub_discipline);
    const seen = (this.state.events_history as unknown as EventLogEntry[]).map((e) => e.event_id);
    this.pendingEvents = selectTurnEvents(pool, {
      stage: this.stage,
      recentCategories: this.lastCategories,
      seenEventIds: seen,
    });
    this.view = this.pendingEvents.length > 0 ? 'event' : 'turn';
  }

  get allEventsResolved(): boolean {
    return this.pendingEvents.every((e) => e.resolved != null);
  }

  // Respond to a presented event: apply the chosen choice's effects, show its
  // outcome, and record it. `choiceIndex` of -1 means a plain acknowledge.
  resolveEvent(eventId: string, choiceIndex: number): void {
    const current = this.state;
    if (!current) return;
    const entry = this.pendingEvents.find((e) => e.event.event_id === eventId);
    if (!entry || entry.resolved != null) return;

    const choice = choiceIndex >= 0 ? entry.event.choices?.[choiceIndex] : undefined;
    let next = current;
    if (choice) next = applyEventEffects(next, choice.effects);
    const result = choice ? choice.result : 'Noted, and quietly filed away.';

    const log: EventLogEntry = {
      event_id: eventId,
      turn: current.calendar.turn_number,
      date: current.calendar.current_date,
    };
    this.state = {
      ...next,
      events_history: [
        ...(next.events_history as unknown as EventLogEntry[]),
        log,
      ] as unknown as SaveGame['events_history'],
    };
    this.pendingEvents = this.pendingEvents.map((e) =>
      e.event.event_id === eventId ? { ...e, resolved: result } : e,
    );
  }

  // Proceed to the campus once every event has been answered.
  continueEvents(): void {
    if (this.allEventsResolved) this.view = 'turn';
  }

  reset(): void {
    clearSave();
    this.state = null;
    this.allocation = emptyAllocation();
    this.activitySpent = {};
    this.waitingSpent = 0;
    this.movementSpent = 0;
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

    const movementSpent = this.movementSpent;
    const missedAppointments = this.appointments
      .filter((a) => a.status === 'missed')
      .map((a) => a.title);
    const progressBefore = subGoalProgress(subGoalFor(current));
    let advanced: Rival[] = this.rivals;
    const next = runTurn(current, this.stage, {
      allocation: this.allocation,
      rivals: this.rivals,
      onRivals: (r) => {
        advanced = r;
      },
    });
    let merged: SaveGame = { ...next, rivals: advanced as unknown as SaveGame['rivals'] };

    this.pendingEnd = merged.calendar.turn_number >= totalTurns();
    if (this.pendingEnd) {
      const decision = decideTenure(merged);
      if (decision.offered) merged = applyTenure(merged);
    }

    this.state = merged;
    saveGame(merged);

    // Build the end-of-turn diary from before/after state, then show it.
    const eventTitles = (current.events_history as unknown as { event_id: string; turn: number }[])
      .filter((e) => e.turn === current.calendar.turn_number)
      .map((e) => EVENT_TITLE.get(e.event_id) ?? e.event_id);
    const progressAfter = subGoalProgress(subGoalFor(merged));
    // Fold an occasional in-world rival sighting into the diary recap, tied to
    // where the turn was spent (the cohort tracker remains the full comparison
    // view).
    const visitedThisTurn = (merged.player.location_visits as LocationVisit[])
      .filter((v) => v.turn === current.calendar.turn_number)
      .map((v) => v.location as LocationId);
    const sighting = rivalSighting(advanced, visitedThisTurn);
    this.recap = buildRecap({
      before: current,
      after: merged,
      allocation: committed,
      movementSpent,
      eventTitles,
      rivalLine: sighting?.text,
      missedAppointments,
      progressBefore,
      progressAfter,
    });
    this.allocation = emptyAllocation();
    this.waitingSpent = 0;
    this.movementSpent = 0;
    this.view = 'recap';
  }

  // Advance from the diary to the next turn, or to the end screen if the career
  // is over.
  continueFromRecap(): void {
    this.recap = null;
    if (this.pendingEnd) {
      this.view = 'end';
      return;
    }
    this.beginTurn();
  }

  private isOver(state: SaveGame): boolean {
    return state.player.standing.rank === 'tenured' || state.calendar.turn_number >= totalTurns();
  }
}
