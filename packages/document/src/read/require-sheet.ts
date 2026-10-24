/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { Artwork } from '../model/artwork.type';
import type { SheetId } from '../model/ids.type';
import type { Sheet } from '../model/sheet.type';
import { findSheet } from './find-sheet';

const requireSheet = (artwork: Artwork, id: SheetId): Sheet => {
  const sheet = findSheet(artwork, id);
  if (!sheet) throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Sheet ${id} does not exist.`);
  return sheet;
};

export { requireSheet };
