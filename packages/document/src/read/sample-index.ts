/* @layer core @kind logic */
import type { Point } from '../model/geometry.type';
import type { FrameId } from '../model/ids.type';
import type { Sprite } from '../model/sprite.type';
import { drawnLayers } from './drawn-layers';

const sampleIndex = (sprite: Sprite, frameId: FrameId, point: Point): number | null => {
  const insideX = point.x >= 0 && point.x < sprite.width;
  const insideY = point.y >= 0 && point.y < sprite.height;
  if (!insideX || !insideY) return null;
  const offset = point.y * sprite.width + point.x;
  for (const { pixels } of drawnLayers(sprite, frameId).reverse()) {
    const value = pixels[offset] ?? 0;
    if (value !== 0) return value;
  }
  return 0;
};

export { sampleIndex };
