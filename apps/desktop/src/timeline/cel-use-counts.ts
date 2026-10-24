/* @layer renderer-app @kind logic */
import type { CelId, Sprite } from '@bxel/document';

const celUseCounts = (sprite: Sprite): ReadonlyMap<CelId, number> => {
  const counts = new Map<CelId, number>();
  for (const layer of sprite.layers) {
    for (const celId of Object.values(layer.cels)) counts.set(celId, (counts.get(celId) ?? 0) + 1);
  }
  return counts;
};

export { celUseCounts };
