/* @layer core @kind logic */
import type { IdSource } from '../ids/id-source.type';
import type { CelId, FrameId, LayerId } from '../model/ids.type';
import type { Cel, Sprite } from '../model/sprite.type';
import type { FrameCopy } from './frame-copy.type';

const planFrameCopy = (ids: IdSource, sprite: Sprite, source: FrameId, linked: boolean): FrameCopy => {
  const links = new Map<LayerId, CelId>();
  const cels: Record<CelId, Cel> = {};
  const copied = new Map<CelId, CelId>();
  for (const layer of sprite.layers) {
    const celId = layer.cels[source];
    const cel = celId ? sprite.cels[celId] : undefined;
    if (!celId || !cel) continue;
    if (linked) {
      links.set(layer.id, celId);
      continue;
    }
    const copyId = copied.get(celId) ?? (ids.next('cel') as CelId);
    copied.set(celId, copyId);
    cels[copyId] = { id: copyId, pixels: cel.pixels.slice() };
    links.set(layer.id, copyId);
  }
  return { links, cels };
};

export { planFrameCopy };
