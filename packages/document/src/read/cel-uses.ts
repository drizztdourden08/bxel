/* @layer core @kind logic */
import type { CelId, FrameId } from '../model/ids.type';
import type { Sprite } from '../model/sprite.type';
import type { CelUse } from './cel-use.type';

const celUses = (sprite: Sprite, celId: CelId): CelUse[] => {
  const uses: CelUse[] = [];
  for (const layer of sprite.layers) {
    for (const [frameId, id] of Object.entries(layer.cels)) {
      if (id === celId) uses.push({ layerId: layer.id, frameId: frameId as FrameId });
    }
  }
  return uses;
};

export { celUses };
