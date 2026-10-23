/* @layer core @kind logic */
import { checkPalette } from './check-palette';
import { expandPixels } from './expand-pixels';
import { inflateImage } from './inflate-image';
import { isPngFailure } from './is-png-failure';
import { parseIhdr } from './parse-ihdr';
import { PNG_ERROR_CODE } from './png-error.constants';
import { pngFail } from './png-fail';
import type { PngDecodeResult } from './png.type';
import { readChunks } from './read-chunks';
import { rowStride } from './row-stride';
import { unfilterScanlines } from './unfilter-scanlines';

const decodePng = (bytes: Uint8Array): PngDecodeResult => {
  const chunks = readChunks(bytes);
  if (isPngFailure(chunks)) return chunks;
  const header = parseIhdr(chunks.ihdr);
  if (isPngFailure(header)) return header;
  const badPalette = checkPalette(header, chunks.plte);
  if (badPalette) return badPalette;
  const stride = rowStride(header.width, header.bitsPerPixel);
  const geometry = { stride, bpp: Math.max(1, header.bitsPerPixel >> 3), height: header.height };
  const raw = inflateImage(chunks.idat, header.height * (stride + 1));
  if (isPngFailure(raw)) return raw;
  const data = unfilterScanlines(raw, geometry);
  if (isPngFailure(data)) return data;
  const rgba = expandPixels({ data, header, plte: chunks.plte, trns: chunks.trns });
  if (!rgba) return pngFail(PNG_ERROR_CODE.PNG_INVALID_DATA, 'A pixel index is outside the PLTE');
  return { ok: true, width: header.width, height: header.height, data: rgba };
};

export { decodePng };
