/* @layer tests @kind helper */
import type { SheetMetadata, SheetSpriteEntry } from '@bxel/formats';

const spriteEntry = (metadata: SheetMetadata, index: number): SheetSpriteEntry => {
  const entry = metadata.sprites[index];
  if (!entry) throw new Error(`No sprite entry ${index}`);
  return entry;
};

export { spriteEntry };
