// YAML content loader (specification §2).
//
// Parses YAML pack documents into the typed objects defined in `./types`, and
// loads the core layer at build time. Layer precedence and override are added
// by a later prompt (`015`); this module only reads and validates packs.

import { load } from 'js-yaml';
import type { ContentEvent, ContentPack, EventChoice, EventEffects, PackMeta } from './types';

function asRecord(value: unknown, context: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${context} must be a mapping.`);
  }
  return value as Record<string, unknown>;
}

function asString(value: unknown, context: string): string {
  if (typeof value !== 'string') {
    throw new Error(`${context} must be a string.`);
  }
  return value;
}

function parseMeta(value: unknown): PackMeta {
  const record = asRecord(value, 'Pack meta');
  const layer = asString(record.layer, 'Pack meta.layer');
  if (layer !== 'core' && layer !== 'discipline' && layer !== 'sub-discipline') {
    throw new Error(`Pack meta.layer must be a content layer, got "${layer}".`);
  }
  const meta: PackMeta = {
    id: asString(record.id, 'Pack meta.id'),
    name: asString(record.name, 'Pack meta.name'),
    layer,
  };
  if (record.parent !== undefined) {
    meta.parent = record.parent === null ? null : asString(record.parent, 'Pack meta.parent');
  }
  return meta;
}

function parseEvent(value: unknown): ContentEvent {
  const record = asRecord(value, 'Event');
  const event: ContentEvent = {
    event_id: asString(record.event_id, 'Event.event_id'),
    title: asString(record.title, 'Event.title'),
    body: asString(record.body, 'Event.body'),
  };
  if (record.conditions !== undefined) {
    event.conditions = asRecord(record.conditions, 'Event.conditions') as ContentEvent['conditions'];
  }
  if (record.effects !== undefined) {
    event.effects = asRecord(record.effects, 'Event.effects') as ContentEvent['effects'];
  }
  if (record.tags !== undefined) {
    if (!Array.isArray(record.tags)) {
      throw new Error('Event.tags must be a list.');
    }
    event.tags = record.tags.map((tag) => asString(tag, 'Event.tags entry'));
  }
  if (record.choices !== undefined) {
    if (!Array.isArray(record.choices)) {
      throw new Error('Event.choices must be a list.');
    }
    event.choices = record.choices.map(parseChoice);
  }
  return event;
}

function parseChoice(value: unknown): EventChoice {
  const record = asRecord(value, 'Choice');
  const choice: EventChoice = {
    label: asString(record.label, 'Choice.label'),
    result: asString(record.result, 'Choice.result'),
  };
  if (record.effects !== undefined) {
    choice.effects = asRecord(record.effects, 'Choice.effects') as EventEffects;
  }
  return choice;
}

// Parse a single pack YAML document into a typed ContentPack.
export function parsePack(yamlText: string): ContentPack {
  const record = asRecord(load(yamlText), 'Content pack');
  const events = record.events === undefined ? [] : record.events;
  if (!Array.isArray(events)) {
    throw new Error('Content pack events must be a list.');
  }
  return {
    meta: parseMeta(record.meta),
    events: events.map(parseEvent),
  };
}

// Load every pack in the core layer (specification §2, Layer 1). Returns an
// empty array until core content files are authored.
export function loadCorePacks(): ContentPack[] {
  const files = import.meta.glob('/content/core/*.yaml', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  return Object.values(files).map(parsePack);
}

// Load every pack across all layers. Each pack declares its own `meta.layer`,
// so the override resolver in `./inheritance` applies the correct precedence.
export function loadAllPacks(): ContentPack[] {
  const files = import.meta.glob('/content/**/*.yaml', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  return Object.values(files).map(parsePack);
}
