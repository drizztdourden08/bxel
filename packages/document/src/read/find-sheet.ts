/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import type { SheetId } from '../model/ids.type';
import type { Sheet } from '../model/sheet.type';

const findSheet = (artwork: Artwork, id: SheetId): Sheet | undefined =>
  artwork.sheets.find((sheet) => sheet.id === id);

export { findSheet };
