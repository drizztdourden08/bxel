/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import type { SlotUse } from './palette-panel.type';

const countSprite = (sprite: Sprite, pixels: number[], frames: Set<string>[]): void => {
  for (const layer of sprite.layers) {
    for (const [frameId, celId] of Object.entries(layer.cels)) {
      const cel = sprite.cels[celId];
      if (!cel) continue;
      for (const value of cel.pixels) {
        pixels[value] = (pixels[value] ?? 0) + 1;
        frames[value]?.add(`${sprite.id}/${frameId}`);
      }
    }
  }
};

const slotUsage = (sprites: readonly Sprite[], slotCount: number): SlotUse[] => {
  const pixels: number[] = Array.from({ length: slotCount }, () => 0);
  const frames = Array.from({ length: slotCount }, () => new Set<string>());
  for (const sprite of sprites) countSprite(sprite, pixels, frames);
  return pixels.map((count, slot) => ({ pixels: count, frames: frames[slot]?.size ?? 0 }));
};

export { slotUsage };
