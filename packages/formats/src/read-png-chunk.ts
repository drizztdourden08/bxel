/* @layer core @kind logic */
import { crc32 } from './crc32';
import type { RawChunk } from './png-decode.type';
import { PNG_ERROR_CODE } from './png-error.constants';
import { pngFail } from './png-fail';
import type { PngFailure } from './png.type';
import { readU32 } from './read-u32';

const CHUNK_OVERHEAD = 12;

const typeOf = (bytes: Uint8Array, offset: number): string =>
  String.fromCharCode(
    bytes[offset + 4] ?? 0,
    bytes[offset + 5] ?? 0,
    bytes[offset + 6] ?? 0,
    bytes[offset + 7] ?? 0,
  );

const readPngChunk = (bytes: Uint8Array, offset: number): RawChunk | PngFailure => {
  if (offset + CHUNK_OVERHEAD > bytes.length) {
    return pngFail(PNG_ERROR_CODE.PNG_TRUNCATED, 'File ends before the next chunk is complete');
  }
  const length = readU32(bytes, offset);
  const end = offset + 8 + length;
  if (end + 4 > bytes.length) {
    return pngFail(PNG_ERROR_CODE.PNG_TRUNCATED, 'File ends inside a chunk');
  }
  const type = typeOf(bytes, offset);
  if (crc32(bytes.subarray(offset + 4, end)) !== readU32(bytes, end)) {
    return pngFail(PNG_ERROR_CODE.PNG_CHECKSUM, `Chunk ${type} fails its CRC-32 check`);
  }
  return { type, data: bytes.subarray(offset + 8, end), next: end + 4 };
};

export { readPngChunk };
