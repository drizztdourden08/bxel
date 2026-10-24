/* @layer core @kind logic */
import type { SheetSpriteEntry } from './sheet-metadata.type';

const spriteFrameOffsets = (sprites: readonly SheetSpriteEntry[]): number[] => {
  const offsets: number[] = [];
  let total = 0;
  for (const sprite of sprites) {
    offsets.push(total);
    total += sprite.frames.length;
  }
  return offsets;
};

export { spriteFrameOffsets };
