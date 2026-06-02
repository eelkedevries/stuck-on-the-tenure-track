// Deadline types (specification §4.11a; prompt 080).
//
// Deadlines are calendar-bound pressures that feed existing systems. The first
// kinds are grant calls, milestone reviews, and teaching prep; the model is
// designed to extend to paper revisions, health, relationship, and admin
// deadlines. All fields are JSON-serialisable.

import type { MilestoneId } from '../milestones/milestones';

export type DeadlineType = 'grant_call' | 'milestone' | 'teaching_prep';

export type DeadlineStatus = 'pending' | 'met' | 'missed';

// Urgency relative to the current date, for the at-a-glance pressure UI.
export type Urgency = 'overdue' | 'due_now' | 'soon' | 'later';

export interface Deadline {
  deadline_id: string;
  type: DeadlineType;
  title: string;
  due_date: string; // ISO date
  status: DeadlineStatus;
  // Present on milestone deadlines, naming which review is due.
  milestone?: MilestoneId;
}
