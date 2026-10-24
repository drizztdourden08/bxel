/* @layer core @kind logic */
import { gunzipSync, unzlibSync } from 'fflate';
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';

const fromBase64 = (text: string): Uint8Array | null => {
  try {
    return Uint8Array.from(atob(text.replaceAll(/\s+/g, '')), (char) => char.codePointAt(0) ?? 0);
  } catch {
    return null;
  }
};

const inflate = (bytes: Uint8Array, compression: string, size: number): Uint8Array | FormatFailure => {
  if (compression === '') return bytes;
  const out = new Uint8Array(size);
  try {
    if (compression === 'zlib') return unzlibSync(bytes, { out });
    if (compression === 'gzip') return gunzipSync(bytes, { out });
  } catch {
    return formatFail(FORMAT_ERROR_CODE.TILED_INVALID, 'The tile layer data cannot be unpacked.');
  }
  return formatFail(FORMAT_ERROR_CODE.TILED_UNSUPPORTED, `The tile layer compression ${compression} is not supported. Save the map with zlib, gzip or no compression.`);
};

const inflateLayer = (text: string, compression: string, size: number): Uint8Array | FormatFailure => {
  const bytes = fromBase64(text);
  if (!bytes) return formatFail(FORMAT_ERROR_CODE.TILED_INVALID, 'The tile layer data is not valid base64.');
  return inflate(bytes, compression, size);
};

export { inflateLayer };
