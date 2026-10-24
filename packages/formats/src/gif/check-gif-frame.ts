/* @layer core @kind logic */
import type { FormatFailure } from '../failure/format.type';
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { IndexedFrame } from '../animation/animation.type';
import { GIF_LIMITS } from './gif-limits.constants';

const checkGifFrame = (
  frame: IndexedFrame,
  pixelCount: number,
  entries: number,
): FormatFailure | undefined => {
  const maxDelayMs = GIF_LIMITS.MAX_DELAY_CS * GIF_LIMITS.MS_PER_CS;
  if (!Number.isInteger(frame.delayMs) || frame.delayMs < 1 || frame.delayMs > maxDelayMs) {
    return formatFail(FORMAT_ERROR_CODE.GIF_INVALID_INPUT, `Frame delay must be 1 to ${maxDelayMs} ms`);
  }
  if (frame.indices.length !== pixelCount) {
    return formatFail(FORMAT_ERROR_CODE.GIF_INVALID_INPUT, `Frame holds ${frame.indices.length} indices, expected ${pixelCount}`);
  }
  const count = frame.indices.length;
  for (let at = 0; at < count; at += 1) {
    const index = frame.indices[at] ?? 0;
    if (index >= entries) {
      return formatFail(FORMAT_ERROR_CODE.GIF_INVALID_INPUT, `Index ${index} is outside the palette`);
    }
  }
  return undefined;
};

export { checkGifFrame };
