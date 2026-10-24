/* @layer core @kind logic */
import type { SheetId } from '../model/ids.type';
import type { Sheet } from '../model/sheet.type';
import { requireSheet } from '../read/require-sheet';
import type { Draft } from './draft.type';
import { updateArtwork } from './update-artwork';

const updateSheet = (draft: Draft, sheetId: SheetId, change: (sheet: Sheet) => Sheet): void => {
  const next = change(requireSheet(draft.artwork, sheetId));
  updateArtwork(draft, (artwork) => ({
    ...artwork,
    sheets: artwork.sheets.map((sheet) => (sheet.id === sheetId ? next : sheet)),
  }));
};

export { updateSheet };
