/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { SHEET_LIMITS } from './sheet-limits.constants';
import type { PackedItem, PackResult } from './sheet.type';

const finishPack = (width: number, height: number, items: readonly PackedItem[]): PackResult => {
  if (width > SHEET_LIMITS.MAX_SIDE || height > SHEET_LIMITS.MAX_SIDE) {
    return formatFail(
      FORMAT_ERROR_CODE.SHEET_TOO_LARGE,
      `The sheet would be ${width} x ${height}, over ${SHEET_LIMITS.MAX_SIDE}`,
    );
  }
  return { ok: true, width, height, items };
};

export { finishPack };
