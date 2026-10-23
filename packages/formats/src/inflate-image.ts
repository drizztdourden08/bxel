/* @layer core @kind logic */
import { unzlibSync } from 'fflate';
import { PNG_ERROR_CODE } from './png-error.constants';
import { pngFail } from './png-fail';
import type { PngFailure } from './png.type';

const inflateImage = (idat: Uint8Array, expectedLength: number): Uint8Array | PngFailure => {
  let raw: Uint8Array;
  try {
    raw = unzlibSync(idat);
  } catch {
    return pngFail(PNG_ERROR_CODE.PNG_INVALID_DATA, 'The image data is not a valid zlib stream');
  }
  if (raw.length < expectedLength) {
    return pngFail(PNG_ERROR_CODE.PNG_TRUNCATED, 'The image data holds fewer rows than the header');
  }
  return raw;
};

export { inflateImage };
