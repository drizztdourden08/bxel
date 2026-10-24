/* @layer core @kind logic */
import { sheetSizes } from '../sheet/sheet-sizes';
import { arrangeSheet } from '../sheet/arrange-sheet';
import type { Draft } from './draft.type';
import { updateArtwork } from './update-artwork';

const rearrangeSheets = (draft: Draft): void => {
  const sizes = sheetSizes(draft.artwork);
  updateArtwork(draft, (artwork) => ({
    ...artwork,
    sheets: artwork.sheets.map((sheet) => arrangeSheet(sheet, sizes)),
  }));
};

export { rearrangeSheets };
