/* @layer core @kind logic */
import { trimPivot } from '@bxel/document';
import type { IdSource, Sprite, SpriteId } from '@bxel/document';
import { anchoredFrame } from '../anchored-frame';
import { clampPivot } from '../clamp-pivot';
import { appendSource } from './append-source';
import type { MergeSpec, SpriteParts } from './compose.type';

const buildMerged = (ids: IdSource, sources: readonly [Sprite, ...Sprite[]], spec: MergeSpec): Sprite => {
  const [lead] = sources;
  const size = { width: Math.max(...sources.map((each) => each.width)), height: Math.max(...sources.map((each) => each.height)) };
  const parts: SpriteParts = { layers: [], frames: [], cels: {}, tags: [] };
  for (const source of sources) appendSource({ ids, source, frame: anchoredFrame(source, size, spec.anchor) }, parts);
  return {
    id: ids.next('spr') as SpriteId,
    name: spec.name,
    created: spec.created,
    role: 'sprite',
    bankId: lead.bankId,
    ...size,
    pivot: clampPivot(trimPivot(lead.pivot, anchoredFrame(lead, size, spec.anchor)), size),
    layers: parts.layers,
    frames: parts.frames,
    tags: parts.tags,
    slices: [],
    cels: parts.cels,
  };
};

export { buildMerged };
