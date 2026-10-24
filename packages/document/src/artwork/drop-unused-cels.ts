/* @layer core @kind logic */
import type { CelId } from '../model/ids.type';
import type { Sprite } from '../model/sprite.type';

const dropUnusedCels = (sprite: Sprite, candidates: Iterable<CelId>): Sprite => {
  const used = new Set<string>(sprite.layers.flatMap((layer) => Object.values(layer.cels)));
  const gone = new Set<string>([...candidates].filter((celId) => !used.has(celId)));
  if (gone.size === 0) return sprite;
  const kept = Object.entries(sprite.cels).filter(([celId]) => !gone.has(celId));
  return { ...sprite, cels: Object.fromEntries(kept) };
};

export { dropUnusedCels };
