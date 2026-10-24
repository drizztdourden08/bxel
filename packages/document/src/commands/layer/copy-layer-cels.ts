/* @layer core @kind logic */
import { addCel } from '../../draft/add-cel';
import type { Draft } from '../../draft/draft.type';
import type { CelId, FrameId } from '../../model/ids.type';
import type { Layer, Sprite } from '../../model/sprite.type';

const copyLayerCels = (draft: Draft, sprite: Sprite, layer: Layer): Record<FrameId, CelId> => {
  const copied = new Map<string, CelId>();
  const cels: Record<FrameId, CelId> = {};
  for (const [frameId, celId] of Object.entries(layer.cels)) {
    const source = sprite.cels[celId];
    if (!source) continue;
    const next = copied.get(celId) ?? addCel(draft, sprite.id, source.pixels.slice());
    copied.set(celId, next);
    cels[frameId as FrameId] = next;
  }
  return cels;
};

export { copyLayerCels };
