/* @layer core @kind logic */
import type { CelChange } from '../commands/result.type';
import type { Rect } from '../model/geometry.type';
import type { FrameId } from '../model/ids.type';
import type { Cel, Sprite } from '../model/sprite.type';
import { diffBounds } from '../pixels/diff-bounds';

const changedRect = (prior: Cel | undefined, cel: Cel, sprite: Sprite): Rect | null => {
  if (!prior || prior.pixels.length !== cel.pixels.length) {
    return { x: 0, y: 0, width: sprite.width, height: sprite.height };
  }
  if (prior.pixels === cel.pixels) return null;
  return diffBounds(prior.pixels, cel.pixels, sprite.width);
};

const celChanges = (before: Sprite | undefined, after: Sprite): CelChange[] => {
  const changes: CelChange[] = [];
  for (const layer of after.layers) {
    for (const [frameId, celId] of Object.entries(layer.cels)) {
      const cel = after.cels[celId];
      const rect = cel ? changedRect(before?.cels[celId], cel, after) : null;
      if (rect) changes.push({ celId, layerId: layer.id, frameId: frameId as FrameId, rect });
    }
  }
  return changes;
};

export { celChanges };
