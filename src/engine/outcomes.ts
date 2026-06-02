// Action outcomes (specification §4.2–§4.6; prompt 075).
//
// Translates a committed time-point allocation into real effects on the
// substantive systems — papers, grants, health, and relationships — reusing
// those systems' own modules. Effects are modest and proportional to time
// spent. Health conditions reduce the productive yield of research and funding,
// so wellbeing genuinely matters. Returns a new SaveGame; the input is not
// mutated. Randomness is injectable for determinism.

import type { SaveGame } from '../state/save';
import type { Allocation } from './actions';
import type { Paper } from '../papers/types';
import type { Npc } from '../relationships/types';
import { submit, publish } from '../papers/lifecycle';
import { accrueCitations } from '../papers/citations';
import { hIndex } from '../papers/hindex';
import { stepWellbeing } from '../health/wellbeing';
import {
  createCondition,
  progressCondition,
  totalProductivityPenalty,
  type HealthCondition,
} from '../health/conditions';
import { decayStep, interact } from '../relationships/decay';
import { stageForTurn } from '../calendar/stages';
import { resolveApplication } from '../grants/success';

const VENUE_BY_TIER: Record<number, { name: string; impact: number }> = {
  1: { name: 'Flagship Journal', impact: 8 },
  2: { name: 'Specialist Journal', impact: 4 },
  3: { name: 'General Journal', impact: 2.5 },
  4: { name: 'Society Journal', impact: 1.5 },
  5: { name: 'Open Mega-Journal', impact: 1 },
};

// Dry, generic working titles for procedurally generated papers.
const TITLE_POOL = [
  'A modest but significant effect',
  'A null result, honestly reported',
  'A conceptual replication, with caveats',
  'A reanalysis nobody asked for',
  'A preregistered disappointment',
  'A robustness check that held',
];

function tierForSkill(skill: number): number {
  if (skill > 60) return 1;
  if (skill > 40) return 2;
  if (skill > 25) return 3;
  return 4;
}

function newPaper(state: SaveGame, index: number): Paper {
  const { methods, statistics, writing } = state.player.expertise;
  const tier = tierForSkill(methods + statistics + writing);
  const venue = VENUE_BY_TIER[tier];
  return {
    paper_id: `paper-${state.calendar.turn_number}-${index}`,
    title: TITLE_POOL[index % TITLE_POOL.length],
    authors: [{ author_id: 'player', position: 1, is_corresponding: true }],
    journal: { name: venue.name, tier, impact_factor: venue.impact },
    status: 'in_preparation',
    date_started: state.calendar.current_date,
    date_submitted: null,
    date_published: null,
    date_retracted: null,
    citations: 0,
    citations_history: [],
    methodology_quality: Math.max(0, Math.min(100, Math.round((methods + statistics) / 2))),
    contains_misconduct: 'none',
    contains_misconduct_by: null,
    preregistered: false,
    open_data: false,
    visibility: 0,
  };
}

export function applyOutcomes(
  state: SaveGame,
  allocation: Allocation,
  rng: () => number = Math.random,
): SaveGame {
  const turn = state.calendar.turn_number;
  const date = state.calendar.current_date;
  const { methods, writing, statistics, politics } = state.player.expertise;

  // Health conditions and high stress both reduce the productive yield of
  // effortful work, so the player has to look after their emotional state.
  const conditions = (state.player.health_conditions ?? []) as unknown as HealthCondition[];
  const penalty = totalProductivityPenalty(conditions);
  const stressNow = state.player.wellbeing.stress;
  const stressPenalty = stressNow > 60 ? Math.min(0.3, (stressNow - 60) / 100) : 0;
  const yield_ = (1 - penalty) * (1 - stressPenalty);
  const research = allocation.research * yield_;
  const funding = allocation.funding * yield_;

  // Students (undergraduate, MSc) build expertise by studying but do not publish
  // papers or win grants; the research career begins at the PhD (§3, §4.11).
  const stage = stageForTurn(state.calendar.turn_number);
  const researchCareer = stage === 'phd' || stage === 'postdoc' || stage === 'assistant_professor';

  // --- Papers (research) -------------------------------------------------
  let papers = (state.player.papers ?? []) as unknown as Paper[];
  // Citations accrue on everything already published.
  papers = papers.map((p) => accrueCitations(p, date));
  if (researchCareer) {
    // Advance the pipeline: publish submitted work, submit prepared work.
    papers = papers.map((p) => {
      if (p.status === 'submitted' && rng() < Math.min(0.6, research / 120 + writing * 0.01)) {
        return publish(p, date);
      }
      if (p.status === 'in_preparation' && rng() < Math.min(0.7, research / 80)) {
        return submit(p, date);
      }
      return p;
    });
    // Start a new paper when research is sustained and the pipeline is not full.
    const inPrep = papers.filter((p) => p.status === 'in_preparation').length;
    if (research >= 25 && inPrep < 2 && rng() < research / 150) {
      papers = [...papers, newPaper(state, papers.length)];
    }
  }

  // --- Grants (funding) --------------------------------------------------
  let grantsHeld = (state.player.grants_held ?? []) as unknown as Record<string, unknown>[];
  let grantsApplied = (state.player.grants_applied ?? []) as unknown as Record<string, unknown>[];
  if (researchCareer && allocation.funding >= 20) {
    const outcome = resolveApplication(
      {
        baseRate: 0.15,
        writing,
        politics,
        timeInvested: funding,
        priorGrants: grantsHeld.length,
        publicationRecord: hIndex(papers),
      },
      rng,
    );
    grantsApplied = [
      ...grantsApplied,
      {
        grant_id: `grant-${turn}`,
        funder: 'National Research Council',
        scheme: 'Project Grant',
        applied_turn: turn,
        probability: outcome.probability,
        outcome: outcome.success ? 'awarded' : 'rejected',
      },
    ];
    if (outcome.success) {
      grantsHeld = [
        ...grantsHeld,
        {
          grant_id: `grant-${turn}`,
          funder: 'National Research Council',
          scheme: 'Project Grant',
          amount: 40000,
          duration_turns: 4,
          awarded_turn: turn,
        },
      ];
    }
  }

  // --- Health (personal vs overwork) ------------------------------------
  const workload =
    allocation.research +
    allocation.teaching +
    allocation.service +
    allocation.funding +
    allocation.networking;
  const wellbeing = stepWellbeing(state.player.wellbeing, {
    sleep: Math.round(allocation.personal / 8 - workload / 40),
    mood: Math.round(allocation.personal / 12 - workload / 60),
    physical: Math.round(allocation.personal / 15 - workload / 80),
    // Intense work raises stress; rest brings it down.
    stress: Math.round(workload / 25 - allocation.personal / 12),
  });
  let nextConditions = conditions.map((c) => progressCondition(c, turn));
  const hasActive = nextConditions.some(
    (c) => c.status === 'active' || c.status === 'chronic',
  );
  if (wellbeing.sleep < 30 && !hasActive && rng() < 0.4) {
    nextConditions = [
      ...nextConditions,
      createCondition(`cond-${turn}`, 'burnout', wellbeing.sleep < 15 ? 'severe' : 'moderate', turn),
    ];
  } else if (wellbeing.stress >= 85 && !hasActive && rng() < 0.4) {
    // Sustained high stress can tip into anxiety.
    nextConditions = [
      ...nextConditions,
      createCondition(`cond-${turn}`, 'anxiety', 'moderate', turn),
    ];
  }

  // --- Relationships (networking/personal) ------------------------------
  const npcs = (state.player.relationships ?? []) as unknown as Npc[];
  const interactionBudget = allocation.networking + Math.floor(allocation.personal / 2);
  const slots = Math.min(npcs.length, Math.floor(interactionBudget / 20));
  // Tend to the most-neglected active relationships first.
  const toInteract = new Set(
    [...npcs]
      .filter((n) => n.relationship_status !== 'ended')
      .sort((a, b) => a.relationship_score - b.relationship_score)
      .slice(0, slots)
      .map((n) => n.npc_id),
  );
  const nextNpcs = npcs.map((n) =>
    toInteract.has(n.npc_id) ? interact(n, turn) : decayStep(n, turn),
  );

  return {
    ...state,
    player: {
      ...state.player,
      wellbeing,
      papers: papers as unknown as SaveGame['player']['papers'],
      grants_held: grantsHeld as unknown as SaveGame['player']['grants_held'],
      grants_applied: grantsApplied as unknown as SaveGame['player']['grants_applied'],
      health_conditions: nextConditions as unknown as SaveGame['player']['health_conditions'],
      relationships: nextNpcs as unknown as SaveGame['player']['relationships'],
    },
  };
}
