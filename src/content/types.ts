// Types for the three-layer content architecture (specification §2).
//
// Discipline-specific content is authored as data under `content/`, never
// hardcoded here (specification §1.3, §2). These types stay generic so the
// loader (`014`) and layer-override logic (`015`) can consume any pack, and so
// every content object serialises to JSON without loss.

// A JSON value. Restricting content objects to this keeps them losslessly
// serialisable to and from JSON (specification §1.3).
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

// The three content layers. Runtime lookup precedence is
// sub-discipline → discipline → core (specification §2).
export type ContentLayer = 'core' | 'discipline' | 'sub-discipline';

// Light, flat effects a choice applies to game state (§4.1, §4.6). Every key is
// optional and additive; unknown keys are ignored by the engine.
export interface EventEffects {
  sleep?: number;
  mood?: number;
  physical?: number;
  stress?: number;
  reputation?: number;
  affiliation_prestige?: number;
  personal_funds?: number;
  research_funds?: number;
  methods?: number;
  theory?: number;
  writing?: number;
  statistics?: number;
  teaching?: number;
  politics?: number;
}

// A player choice within an event: a button label, the one-line outcome shown
// when chosen, and the light effects it applies (specification §4.2, §7).
export interface EventChoice {
  label: string;
  result: string;
  effects?: EventEffects;
}

// A content event. `event_id` drives layer override: a higher-layer event with
// the same id replaces a lower-layer one (specification §2). `conditions` may
// gate by career `stages` (array) and `sub_discipline`. `choices` make the event
// a decision; an event without choices is simply acknowledged.
export interface ContentEvent {
  event_id: string;
  title: string;
  body: string;
  conditions?: Record<string, JsonValue>;
  effects?: Record<string, JsonValue>;
  choices?: EventChoice[];
  tags?: string[];
}

// Pack metadata, as authored in each pack's `meta.yaml` (specification §2).
export interface PackMeta {
  id: string;
  name: string;
  layer: ContentLayer;
  // Parent pack id for sub-discipline packs; null for core and discipline roots.
  parent?: string | null;
}

// A loaded content pack: its metadata and its events. Other content collections
// (journals, conferences, funders, methods, characters) are added by their own
// prompts when their schemas are defined.
export interface ContentPack {
  meta: PackMeta;
  events: ContentEvent[];
}
