/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';
import { concatBytes } from '../concat-bytes';
import { decodePng } from '../decode-png';
import { PNG_CHUNK } from '../png-chunk.constants';
import { PNG_SIGNATURE } from '../png-signature.constants';
import { writePngChunk } from '../write-png-chunk';
import { writeU32 } from '../write-u32';
import type { ApngFrameData, ApngLayout, ApngPixels } from './apng.type';

const decodeApngFrame = (layout: ApngLayout, frame: ApngFrameData): ApngPixels | FormatFailure => {
  const ihdr = Uint8Array.from(layout.ihdr);
  writeU32(ihdr, 0, frame.control.width);
  writeU32(ihdr, 4, frame.control.height);
  const parts = [PNG_SIGNATURE, writePngChunk(PNG_CHUNK.IHDR, ihdr)];
  if (layout.plte) parts.push(writePngChunk(PNG_CHUNK.PLTE, layout.plte));
  if (layout.trns) parts.push(writePngChunk(PNG_CHUNK.TRNS, layout.trns));
  parts.push(writePngChunk(PNG_CHUNK.IDAT, concatBytes(frame.data)));
  parts.push(writePngChunk(PNG_CHUNK.IEND, new Uint8Array(0)));
  const png = decodePng(concatBytes(parts));
  if (!png.ok) return formatFail(FORMAT_ERROR_CODE.APNG_INVALID_DATA, png.message);
  return png;
};

export { decodeApngFrame };
