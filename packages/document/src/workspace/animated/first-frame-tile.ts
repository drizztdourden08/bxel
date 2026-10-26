/* @layer core @kind logic */
import type { CelId } from '../../model/ids.type';
import type { Cel, Sprite } from '../../model/sprite.type';

const firstFrameTile = (sprite: Sprite): Sprite => {
  const [first] = sprite.frames;
  if (!first) return sprite;
  const kept = sprite.layers.map((layer) => {
    const cel = layer.cels[first.id];
    return { ...layer, cels: cel === undefined ? {} : { [first.id]: cel } };
  });
  const used = new Set(kept.flatMap((layer) => Object.values(layer.cels)));
  const cels: Record<CelId, Cel> = {};
  for (const cel of Object.values(sprite.cels)) {
    if (used.has(cel.id)) cels[cel.id] = cel;
  }
  return { ...sprite, frames: [first], tags: [], layers: kept, cels };
};

export { firstFrameTile };
