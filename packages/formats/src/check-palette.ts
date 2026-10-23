/* @layer core @kind logic */
import { PNG_COLOR_TYPE } from './png-color-type.constants';
import type { PngHeader } from './png-decode.type';
import { PNG_ERROR_CODE } from './png-error.constants';
import { pngFail } from './png-fail';
import type { PngFailure } from './png.type';

const checkPalette = (header: PngHeader, plte: Uint8Array | undefined): PngFailure | undefined => {
  if (header.colorType !== PNG_COLOR_TYPE.INDEXED) return undefined;
  if (!plte || plte.length === 0 || plte.length % 3 !== 0) {
    return pngFail(PNG_ERROR_CODE.PNG_INVALID_DATA, 'Indexed PNG needs a valid PLTE chunk');
  }
  if (plte.length / 3 > 2 ** header.bitDepth) {
    return pngFail(PNG_ERROR_CODE.PNG_INVALID_DATA, 'PLTE holds more entries than the bit depth');
  }
  return undefined;
};

export { checkPalette };
