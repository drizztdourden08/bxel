/* @layer core @kind logic */
import { DEFAULT_FRAME_DURATION_MS } from '@bxel/document';
import type { Frame, FrameId, IdSource, SliceId, Sprite, SpriteId, Tag, TagId } from '@bxel/document';
import type { PieceSpec } from './compose.type';
import { pieceLayers } from './piece-layers';

const frameMap = (source: Sprite, spec: PieceSpec, frames: readonly Frame[]): Map<FrameId, FrameId> => {
  const made = new Map<FrameId, FrameId>();
  spec.frames.forEach((at, slot) => {
    const from = source.frames[at];
    const to = frames[slot];
    if (from && to) made.set(from.id, to.id);
  });
  return made;
};

const pieceTags = (ids: IdSource, source: Sprite, made: ReadonlyMap<FrameId, FrameId>): Tag[] =>
  source.tags.flatMap((tag) => {
    const from = made.get(tag.from);
    const to = made.get(tag.to);
    return from && to ? [{ ...tag, id: ids.next('tag') as TagId, from, to }] : [];
  });

const buildPiece = (ids: IdSource, source: Sprite, spec: PieceSpec): Sprite => {
  const frames: Frame[] = spec.frames.map((at) => ({ id: ids.next('frm') as FrameId, durationMs: source.frames[at]?.durationMs ?? DEFAULT_FRAME_DURATION_MS }));
  const { layers, cels } = pieceLayers(ids, source, spec, frames);
  const whole = spec.frames.length === source.frames.length;
  return {
    id: ids.next('spr') as SpriteId,
    name: spec.name,
    role: 'sprite',
    bankId: source.bankId,
    width: spec.size.width,
    height: spec.size.height,
    pivot: spec.pivot,
    layers,
    frames,
    tags: whole ? pieceTags(ids, source, frameMap(source, spec, frames)) : [],
    slices: spec.crop === null ? source.slices.map((slice) => ({ ...slice, id: ids.next('slc') as SliceId })) : [],
    cels,
  };
};

export { buildPiece };
