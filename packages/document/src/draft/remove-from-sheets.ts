/* @layer core @kind logic */
import type { SpriteId } from '../model/ids.type';
import type { Draft } from './draft.type';
import { rearrangeSheets } from './rearrange-sheets';
import { updateArtwork } from './update-artwork';

const removeFromSheets = (draft: Draft, ids: ReadonlySet<SpriteId>): void => {
  updateArtwork(draft, (artwork) => ({
    ...artwork,
    sheets: artwork.sheets.map((sheet) =>
      sheet.entries.some((entry) => ids.has(entry.spriteId))
        ? { ...sheet, entries: sheet.entries.filter((entry) => !ids.has(entry.spriteId)) }
        : sheet,
    ),
  }));
  rearrangeSheets(draft);
};

export { removeFromSheets };
