/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { nextPowerOfTwo } from './next-power-of-two';
import { SHEET_LIMITS } from './sheet-limits.constants';
import type { PackedItem, PackResult } from './sheet.type';

const finishPack = (width: number, height: number, items: readonly PackedItem[], powerOfTwo = false): PackResult => {
  const finalWidth = powerOfTwo ? nextPowerOfTwo(width) : width;
  const finalHeight = powerOfTwo ? nextPowerOfTwo(height) : height;
  if (finalWidth > SHEET_LIMITS.MAX_SIDE || finalHeight > SHEET_LIMITS.MAX_SIDE) {
    return formatFail(
      FORMAT_ERROR_CODE.SHEET_TOO_LARGE,
      `The sheet would be ${finalWidth} x ${finalHeight}, over ${SHEET_LIMITS.MAX_SIDE}`,
    );
  }
  return { ok: true, width: finalWidth, height: finalHeight, items };
};

export { finishPack };
