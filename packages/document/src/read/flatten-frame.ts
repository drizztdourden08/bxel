/* @layer core @kind logic */
import type { FrameId, LayerId } from '../model/ids.type';
import type { Sprite } from '../model/sprite.type';
import { emptyCel } from '../pixels/empty-cel';
import { drawnLayers } from './drawn-layers';

const flattenFrame = (sprite: Sprite, frameId: FrameId, only?: ReadonlySet<LayerId>): Uint8Array => {
  const out = emptyCel(sprite);
  let first = true;
  for (const { pixels } of drawnLayers(sprite, frameId, only)) {
    const length = Math.min(pixels.length, out.length);
    if (first) {
      out.set(length === pixels.length ? pixels : pixels.subarray(0, length));
      first = false;
      continue;
    }
    for (let index = 0; index < length; index += 1) {
      const value = pixels[index] ?? 0;
      if (value !== 0) out[index] = value;
    }
  }
  return out;
};

export { flattenFrame };
