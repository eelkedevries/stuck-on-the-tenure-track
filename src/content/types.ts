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

// A content event. `event_id` drives layer override: a higher-layer event with
// the same id replaces a lower-layer one (specification §2). Gating conditions
// and effects are kept as open JSON maps until the mechanics that consume them
// are specified by later prompts, so authoring can proceed without engine changes.
export interface ContentEvent {
  event_id: string;
  title: string;
  body: string;
  conditions?: Record<string, JsonValue>;
  effects?: Record<string, JsonValue>;
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
