/* @layer core @kind logic */
import { PNG_COLOR_RULES } from './png-color-rules.constants';
import type { PngHeader } from './png-decode.type';
import { PNG_ERROR_CODE } from './png-error.constants';
import { pngFail } from './png-fail';
import { PNG_LIMITS } from './png-limits.constants';
import type { PngFailure } from './png.type';
import { readU32 } from './read-u32';

const IHDR_LENGTH = 13;
const INTERLACE_ADAM7 = 1;

const checkSize = (width: number, height: number): PngFailure | undefined => {
  if (width === 0 || height === 0) {
    return pngFail(PNG_ERROR_CODE.PNG_INVALID_DATA, 'Image width and height must be at least 1');
  }
  if (width > PNG_LIMITS.IMPORT_MAX_SIDE || height > PNG_LIMITS.IMPORT_MAX_SIDE) {
    return pngFail(
      PNG_ERROR_CODE.PNG_TOO_LARGE,
      `Image is ${width} by ${height}, the import limit is ${PNG_LIMITS.IMPORT_MAX_SIDE} per side`,
    );
  }
  return undefined;
};

const checkMethods = (data: Uint8Array): PngFailure | undefined => {
  if (data[10] !== 0 || data[11] !== 0) {
    return pngFail(PNG_ERROR_CODE.PNG_INVALID_DATA, 'Unknown compression or filter method');
  }
  if (data[12] === INTERLACE_ADAM7) {
    return pngFail(PNG_ERROR_CODE.PNG_UNSUPPORTED, 'Adam7 interlaced PNG is not supported');
  }
  return data[12] === 0
    ? undefined
    : pngFail(PNG_ERROR_CODE.PNG_INVALID_DATA, 'Unknown interlace method');
};

const parseIhdr = (data: Uint8Array): PngHeader | PngFailure => {
  if (data.length !== IHDR_LENGTH) {
    return pngFail(PNG_ERROR_CODE.PNG_INVALID_DATA, 'IHDR chunk has the wrong length');
  }
  const width = readU32(data, 0);
  const height = readU32(data, 4);
  const bitDepth = data[8] ?? 0;
  const colorType = data[9] ?? 0;
  const rule = PNG_COLOR_RULES[colorType];
  if (rule === undefined || !rule.depths.includes(bitDepth)) {
    return pngFail(
      PNG_ERROR_CODE.PNG_INVALID_DATA,
      `Colour type ${colorType} does not allow bit depth ${bitDepth}`,
    );
  }
  const failure = checkMethods(data) ?? checkSize(width, height);
  if (failure) return failure;
  return { width, height, bitDepth, colorType, bitsPerPixel: rule.channels * bitDepth };
};

export { parseIhdr };
