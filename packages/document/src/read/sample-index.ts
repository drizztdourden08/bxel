/* @layer core @kind logic */
import type { Point } from '../model/geometry.type';
import type { FrameId } from '../model/ids.type';
import type { Layer, Sprite } from '../model/sprite.type';
import { layerPixels } from './layer-pixels';

const layerValue = (sprite: Sprite, layer: Layer, frameId: FrameId, offset: number): number => {
  if (!layer.visible) return 0;
  return layerPixels(sprite, layer, frameId)?.[offset] ?? 0;
};

const sampleIndex = (sprite: Sprite, frameId: FrameId, point: Point): number | null => {
  const insideX = point.x >= 0 && point.x < sprite.width;
  const insideY = point.y >= 0 && point.y < sprite.height;
  if (!insideX || !insideY) return null;
  const offset = point.y * sprite.width + point.x;
  for (const layer of [...sprite.layers].reverse()) {
    const value = layerValue(sprite, layer, frameId, offset);
    if (value !== 0) return value;
  }
  return 0;
};

export { sampleIndex };
