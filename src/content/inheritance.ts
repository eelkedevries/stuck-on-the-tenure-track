// Layer inheritance and override (specification §2).
//
// Runtime lookup precedence is sub-discipline (Layer 3) → discipline (Layer 2)
// → core (Layer 1). A higher-layer event overrides a lower-layer event with the
// same `event_id`; core events without an override remain universal.

import type { ContentEvent, ContentLayer, ContentPack } from './types';

const LAYER_RANK: Record<ContentLayer, number> = {
  core: 0,
  discipline: 1,
  'sub-discipline': 2,
};

// Resolve events across packs from all layers into a single map keyed by
// `event_id`. Packs are applied from lowest to highest precedence, so a
// higher-layer event with the same id wins. Array sort is stable (ES2019+), so
// packs within the same layer keep their input order.
export function resolveEvents(packs: ContentPack[]): Map<string, ContentEvent> {
  const ordered = [...packs].sort(
    (a, b) => LAYER_RANK[a.meta.layer] - LAYER_RANK[b.meta.layer],
  );
  const resolved = new Map<string, ContentEvent>();
  for (const pack of ordered) {
    for (const event of pack.events) {
      resolved.set(event.event_id, event);
    }
  }
  return resolved;
}

// Look up a single resolved event by id, applying layer precedence.
export function resolveEvent(
  packs: ContentPack[],
  eventId: string,
): ContentEvent | undefined {
  return resolveEvents(packs).get(eventId);
}
