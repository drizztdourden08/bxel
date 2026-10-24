/* @layer tests @kind helper */
import type { SheetFrameEntry, SheetSpriteEntry } from '@bxel/formats';

const frameEntry = (sprite: SheetSpriteEntry, index: number): SheetFrameEntry => {
  const entry = sprite.frames[index];
  if (!entry) throw new Error(`No frame entry ${index}`);
  return entry;
};

export { frameEntry };
