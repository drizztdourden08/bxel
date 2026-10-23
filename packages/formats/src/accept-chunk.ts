/* @layer core @kind logic */
import type { ChunkState, RawChunk } from './png-decode.type';
import { PNG_CHUNK } from './png-chunk.constants';
import { PNG_ERROR_CODE } from './png-error.constants';
import { pngFail } from './png-fail';
import { PNG_LIMITS } from './png-limits.constants';
import type { PngFailure } from './png.type';

const isCritical = (type: string): boolean =>
  ((type.charCodeAt(0) || 0) & PNG_LIMITS.CRITICAL_BIT) === 0;

const storeKnown = (state: ChunkState, chunk: RawChunk): boolean => {
  switch (chunk.type) {
    case PNG_CHUNK.PLTE:
      state.plte = chunk.data;
      return true;
    case PNG_CHUNK.TRNS:
      state.trns = chunk.data;
      return true;
    case PNG_CHUNK.IDAT:
      state.idat.push(chunk.data);
      return true;
    case PNG_CHUNK.IEND:
      state.ended = true;
      return true;
    default:
      return false;
  }
};

const acceptChunk = (state: ChunkState, chunk: RawChunk): PngFailure | undefined => {
  if (state.ihdr === undefined) {
    if (chunk.type !== PNG_CHUNK.IHDR) {
      return pngFail(PNG_ERROR_CODE.PNG_INVALID_DATA, 'The first chunk must be IHDR');
    }
    state.ihdr = chunk.data;
    return undefined;
  }
  if (chunk.type === PNG_CHUNK.IHDR) {
    return pngFail(PNG_ERROR_CODE.PNG_INVALID_DATA, 'Duplicate IHDR chunk');
  }
  if (storeKnown(state, chunk) || !isCritical(chunk.type)) return undefined;
  return pngFail(PNG_ERROR_CODE.PNG_UNSUPPORTED, `Unknown critical chunk ${chunk.type}`);
};

export { acceptChunk };
