/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import type { SpriteUse } from './palette-change.type';

const countIndex = (pixels: Uint8Array, index: number): number => {
  let count = 0;
  for (const value of pixels) {
    if (value === index) count += 1;
  }
  return count;
};

const spriteUse = (sprite: Sprite, index: number): SpriteUse => {
  const hit = new Set<string>();
  let pixels = 0;
  for (const [celId, cel] of Object.entries(sprite.cels)) {
    const count = countIndex(cel.pixels, index);
    if (count === 0) continue;
    hit.add(celId);
    pixels += count;
  }
  const frames = sprite.frames.flatMap((frame, at) => {
    const touched = sprite.layers.some((layer) => hit.has(layer.cels[frame.id] ?? ''));
    return touched ? [at + 1] : [];
  });
  return { pixels, frames };
};

export { spriteUse };
