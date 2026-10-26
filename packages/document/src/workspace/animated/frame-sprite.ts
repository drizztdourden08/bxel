/* @layer core @kind logic */
import type { IdSource } from '../../ids/id-source.type';
import type { CelId, FrameId, LayerId, SliceId, SpriteId } from '../../model/ids.type';
import type { Cel, Frame, Layer, Sprite } from '../../model/sprite.type';

type Pieces = { readonly layers: readonly Layer[]; readonly cels: Readonly<Record<CelId, Cel>> };

const piecesOf = (ids: IdSource, source: Sprite, frame: Frame, frameId: FrameId): Pieces => {
  const cels: Record<CelId, Cel> = {};
  const layers = source.layers.map((layer): Layer => {
    const old = layer.cels[frame.id];
    const cel = old === undefined ? undefined : source.cels[old];
    const fresh = ids.next('cel') as CelId;
    if (cel) cels[fresh] = { id: fresh, pixels: cel.pixels };
    return { ...layer, id: ids.next('lay') as LayerId, cels: cel ? { [frameId]: fresh } : {} };
  });
  return { layers, cels };
};

const frameSprite = (ids: IdSource, source: Sprite, frame: Frame, name: string): Sprite => {
  const frameId = ids.next('frm') as FrameId;
  const { layers, cels } = piecesOf(ids, source, frame, frameId);
  return {
    id: ids.next('spr') as SpriteId,
    name,
    ...(source.created === undefined ? {} : { created: source.created }),
    role: 'frame',
    bankId: source.bankId,
    width: source.width,
    height: source.height,
    pivot: source.pivot,
    ...(source.platformId === undefined ? {} : { platformId: source.platformId }),
    ...(source.platformStrict === undefined ? {} : { platformStrict: source.platformStrict }),
    ...(source.pixelGrid === undefined ? {} : { pixelGrid: source.pixelGrid }),
    layers,
    frames: [{ id: frameId, durationMs: frame.durationMs }],
    tags: [],
    slices: source.slices.map((slice) => ({ ...slice, id: ids.next('slc') as SliceId })),
    cels,
  };
};

export { frameSprite };
