/* @layer core @kind logic */
import type { IdSource } from '../ids/id-source.type';
import type { CelId, FrameId, LayerId, SliceId, SpriteId, TagId } from '../model/ids.type';
import type { Cel, Sprite } from '../model/sprite.type';
import type { CloneIds } from './clone-sprite.type';
import { remapLayerCels } from './remap-layer-cels';

const cloneIds = (ids: IdSource, source: Sprite): CloneIds => ({
  frames: new Map(source.frames.map((frame) => [frame.id, ids.next('frm') as FrameId])),
  cels: new Map(Object.keys(source.cels).map((id) => [id as CelId, ids.next('cel') as CelId])),
});

const cloneCels = (source: Sprite, mapped: CloneIds): Record<CelId, Cel> => {
  const cels: Record<CelId, Cel> = {};
  for (const cel of Object.values(source.cels)) {
    const id = mapped.cels.get(cel.id);
    if (id !== undefined) cels[id] = { id, pixels: cel.pixels };
  }
  return cels;
};

const cloneSprite = (ids: IdSource, source: Sprite, name: string): Sprite => {
  const id = ids.next('spr') as SpriteId;
  const mapped = cloneIds(ids, source);
  return {
    ...source,
    id,
    name,
    layers: source.layers.map((layer) => ({
      ...layer,
      id: ids.next('lay') as LayerId,
      cels: remapLayerCels(layer.cels, mapped),
    })),
    frames: source.frames.map((frame) => ({ ...frame, id: mapped.frames.get(frame.id) ?? frame.id })),
    tags: source.tags.map((tag) => ({
      ...tag,
      id: ids.next('tag') as TagId,
      from: mapped.frames.get(tag.from) ?? tag.from,
      to: mapped.frames.get(tag.to) ?? tag.to,
    })),
    slices: source.slices.map((slice) => ({ ...slice, id: ids.next('slc') as SliceId })),
    cels: cloneCels(source, mapped),
  };
};

export { cloneSprite };
