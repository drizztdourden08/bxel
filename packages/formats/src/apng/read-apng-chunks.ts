/* @layer core @kind logic */
import type { FormatFailure } from '../failure/format.type';
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { isPngFailure } from '../is-png-failure';
import { PNG_CHUNK } from '../png-chunk.constants';
import type { RawChunk } from '../png-decode.type';
import { PNG_ERROR_CODE } from '../png-error.constants';
import { PNG_SIGNATURE } from '../png-signature.constants';
import { readPngChunk } from '../read-png-chunk';

const readApngChunks = (bytes: Uint8Array): RawChunk[] | FormatFailure => {
  if (bytes.length < PNG_SIGNATURE.length || PNG_SIGNATURE.some((byte, i) => bytes[i] !== byte)) {
    return formatFail(FORMAT_ERROR_CODE.APNG_INVALID_DATA, 'Not a PNG file');
  }
  const chunks: RawChunk[] = [];
  let offset = PNG_SIGNATURE.length;
  while (chunks.at(-1)?.type !== PNG_CHUNK.IEND) {
    const chunk = readPngChunk(bytes, offset);
    if (isPngFailure(chunk)) {
      const truncated = chunk.code === PNG_ERROR_CODE.PNG_TRUNCATED;
      return formatFail(
        truncated ? FORMAT_ERROR_CODE.APNG_TRUNCATED : FORMAT_ERROR_CODE.APNG_INVALID_DATA,
        chunk.message,
      );
    }
    chunks.push(chunk);
    offset = chunk.next;
  }
  return chunks;
};

export { readApngChunks };
