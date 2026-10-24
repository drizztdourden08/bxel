/* @layer core @kind logic */
import { requireBank, updateSprite } from '@bxel/document';
import type { Draft, PaletteBank, Sprite } from '@bxel/document';
import type { ResolvedPair } from './assign-pair.type';
import { nearestTable } from './nearest-table';
import { remapSprites } from './remap-sprites';

const assignSprites = (draft: Draft, dest: PaletteBank, sprites: readonly Sprite[], pairs: readonly ResolvedPair[]): void => {
  for (const sourceId of new Set(sprites.map((sprite) => sprite.bankId))) {
    const source = requireBank(draft.artwork, sourceId);
    const table = nearestTable(source, dest);
    for (const pair of pairs.filter((item) => item.source === sourceId)) table[pair.from] = pair.to;
    for (const sprite of sprites.filter((item) => item.bankId === sourceId)) {
      remapSprites(draft, [sprite.id], table);
      updateSprite(draft, sprite.id, (current) => ({ ...current, bankId: dest.id }));
    }
  }
};

export { assignSprites };
