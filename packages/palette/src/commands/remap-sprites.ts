/* @layer core @kind logic */
import { remapCel, requireSprite, writableCel } from '@bxel/document';
import type { Draft, SpriteId } from '@bxel/document';

const remapSprites = (draft: Draft, spriteIds: readonly SpriteId[], table: Uint8Array): void => {
  for (const spriteId of spriteIds) {
    for (const cel of Object.values(requireSprite(draft.artwork, spriteId).cels)) {
      if (cel.pixels.every((value) => (table[value] ?? value) === value)) continue;
      const pixels = writableCel(draft, spriteId, cel.id);
      pixels.set(remapCel(pixels, table));
    }
  }
};

export { remapSprites };
