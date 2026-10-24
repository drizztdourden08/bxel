/* @layer core @kind logic */
import type { SpriteId } from '../model/ids.type';
import type { Sheet } from '../model/sheet.type';
import type { Draft } from './draft.type';
import { rearrangeSheets } from './rearrange-sheets';
import { updateArtwork } from './update-artwork';

const sortEntries = (sheet: Sheet, rank: ReadonlyMap<SpriteId, number>): Sheet => {
  const position = (id: SpriteId): number => rank.get(id) ?? rank.size;
  const sorted = [...sheet.entries].sort((a, b) => position(a.spriteId) - position(b.spriteId));
  return sorted.every((entry, index) => entry === sheet.entries[index]) ? sheet : { ...sheet, entries: sorted };
};

const syncSheetOrder = (draft: Draft): void => {
  const rank = new Map(draft.artwork.sprites.map((sprite, index) => [sprite.id, index] as const));
  updateArtwork(draft, (artwork) => ({ ...artwork, sheets: artwork.sheets.map((sheet) => sortEntries(sheet, rank)) }));
  rearrangeSheets(draft);
};

export { syncSheetOrder };
