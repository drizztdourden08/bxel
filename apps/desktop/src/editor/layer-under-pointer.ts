/* @layer renderer-app @kind logic */
import { drawnLayers } from '@bxel/document';
import type { FrameId, LayerId, Sprite } from '@bxel/document';
import type { Point } from '@bxel/raster';

const layerUnderPointer = (sprite: Sprite, frameId: FrameId, at: Point): LayerId | null => {
  if (at.x < 0 || at.y < 0 || at.x >= sprite.width || at.y >= sprite.height) return null;
  const offset = at.y * sprite.width + at.x;
  const hit = drawnLayers(sprite, frameId).reverse().find(({ pixels }) => (pixels[offset] ?? 0) !== 0);
  return hit?.layer.id ?? null;
};

export { layerUnderPointer };
