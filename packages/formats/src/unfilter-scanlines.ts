/* @layer core @kind logic */
import { PNG_ERROR_CODE } from './png-error.constants';
import { pngFail } from './png-fail';
import type { PngFailure } from './png.type';
import type { RowGeometry } from './scanline.type';
import { unfilterRow } from './unfilter-row';

const unfilterScanlines = (raw: Uint8Array, geometry: RowGeometry): Uint8Array | PngFailure => {
  const out = new Uint8Array(geometry.stride * geometry.height);
  for (let row = 0; row < geometry.height; row += 1) {
    if (!unfilterRow(out, raw, geometry, row)) {
      return pngFail(PNG_ERROR_CODE.PNG_INVALID_DATA, `Row ${row} has an unknown filter type`);
    }
  }
  return out;
};

export { unfilterScanlines };
