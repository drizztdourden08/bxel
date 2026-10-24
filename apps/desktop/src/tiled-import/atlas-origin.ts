/* @layer renderer-app @kind logic */
import type { TiledPlan } from '@bxel/formats';

const atlasOrigin = (index: number, columns: number, plan: TiledPlan): { x: number; y: number } => ({
  x: (index % columns) * plan.tileWidth,
  y: Math.floor(index / columns) * plan.tileHeight,
});

export { atlasOrigin };
