/* @layer core @kind logic */
import type { ApngAnimation, ApngFrame } from '../animation/animation.type';
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';
import { encodePngIndexed } from '../encode-png-indexed';
import { encodePngRgba } from '../encode-png-rgba';
import type { PngChunks } from '../png-decode.type';
import { readChunks } from '../read-chunks';
import { isPngFailure } from '../is-png-failure';

const encodeApngFrame = (animation: ApngAnimation, frame: ApngFrame): PngChunks | FormatFailure => {
  const { width, height, palette } = animation;
  const encoded = palette
    ? encodePngIndexed({ indices: Uint8Array.from(frame.pixels), palette, width, height })
    : encodePngRgba({ data: Uint8ClampedArray.from(frame.pixels), width, height });
  if (!encoded.ok) return formatFail(FORMAT_ERROR_CODE.APNG_INVALID_INPUT, encoded.message);
  const chunks = readChunks(encoded.bytes);
  if (isPngFailure(chunks)) return formatFail(FORMAT_ERROR_CODE.APNG_INVALID_DATA, chunks.message);
  return chunks;
};

export { encodeApngFrame };
