/* @layer core @kind logic */
import type { FrameId } from '../model/ids.type';
import type { Sprite } from '../model/sprite.type';
import { emptyCel } from '../pixels/empty-cel';
import { layerPixels } from './layer-pixels';

const flattenFrame = (sprite: Sprite, frameId: FrameId): Uint8Array => {
  const out = emptyCel(sprite);
  for (const layer of sprite.layers) {
    const pixels = layer.visible ? layerPixels(sprite, layer, frameId) : undefined;
    if (!pixels) continue;
    for (const [index, value] of pixels.entries()) {
      if (value !== 0) out[index] = value;
    }
  }
  return out;
};

export { flattenFrame };
