/* @layer core @kind logic */
import { acceptChunk } from './accept-chunk';
import { concatBytes } from './concat-bytes';
import { isPngFailure } from './is-png-failure';
import type { ChunkState, PngChunks } from './png-decode.type';
import { PNG_ERROR_CODE } from './png-error.constants';
import { pngFail } from './png-fail';
import { PNG_SIGNATURE } from './png-signature.constants';
import type { PngFailure } from './png.type';
import { readPngChunk } from './read-png-chunk';

const checkSignature = (bytes: Uint8Array): PngFailure | undefined => {
  const seen = Math.min(bytes.length, PNG_SIGNATURE.length);
  for (let i = 0; i < seen; i += 1) {
    if (bytes[i] !== PNG_SIGNATURE[i]) {
      return pngFail(PNG_ERROR_CODE.PNG_INVALID_SIGNATURE, 'Not a PNG file');
    }
  }
  if (bytes.length < PNG_SIGNATURE.length) {
    return pngFail(PNG_ERROR_CODE.PNG_TRUNCATED, 'File ends inside the PNG signature');
  }
  return undefined;
};

const readChunks = (bytes: Uint8Array): PngChunks | PngFailure => {
  const badSignature = checkSignature(bytes);
  if (badSignature) return badSignature;
  const state: ChunkState = {
    ihdr: undefined,
    plte: undefined,
    trns: undefined,
    idat: [],
    ended: false,
  };
  let offset = PNG_SIGNATURE.length;
  while (!state.ended) {
    const chunk = readPngChunk(bytes, offset);
    if (isPngFailure(chunk)) return chunk;
    const rejected = acceptChunk(state, chunk);
    if (rejected) return rejected;
    offset = chunk.next;
  }
  if (state.ihdr === undefined || state.idat.length === 0) {
    return pngFail(PNG_ERROR_CODE.PNG_INVALID_DATA, 'The file has no image data');
  }
  return { ihdr: state.ihdr, plte: state.plte, trns: state.trns, idat: concatBytes(state.idat) };
};

export { readChunks };
