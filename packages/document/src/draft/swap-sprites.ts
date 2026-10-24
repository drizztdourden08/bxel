/* @layer core @kind logic */
import type { Point } from '../model/geometry.type';
import type { SpriteId } from '../model/ids.type';
import type { Sheet } from '../model/sheet.type';
import { addSheetEntry } from './add-sheet-entry';
import { dropSprites } from './drop-sprites';
import type { Draft } from './draft.type';
import { insertSprite } from './insert-sprite';
import type { SpriteSwap } from './swap-sprites.type';
import { syncSheetOrder } from './sync-sheet-order';

const heldAt = (sheet: Sheet, sources: ReadonlySet<SpriteId>): Point | null =>
  sheet.entries.find((entry) => sources.has(entry.spriteId))?.at ?? null;

const place = (draft: Draft, swap: SpriteSwap): void => {
  const sources = new Set(swap.sources);
  for (const sheet of draft.artwork.sheets) {
    const at = heldAt(sheet, sources);
    if (at === null) continue;
    swap.made.forEach((sprite, index) => {
      const here = index === 0 && !swap.keep && sheet.layout.kind === 'manual' ? { at } : {};
      addSheetEntry(draft, sheet.id, sprite.id, here);
    });
  }
};

const swapSprites = (draft: Draft, swap: SpriteSwap): void => {
  const first = draft.artwork.sprites.find((sprite) => swap.sources.includes(sprite.id));
  if (!first) return;
  let after = first.id;
  for (const sprite of swap.made) {
    insertSprite(draft, sprite, after);
    after = sprite.id;
  }
  place(draft, swap);
  if (!swap.keep) dropSprites(draft, new Set(swap.sources));
  syncSheetOrder(draft);
};

export { swapSprites };
