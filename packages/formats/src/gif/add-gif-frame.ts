/* @layer core @kind logic */
import type { FormatFailure } from '../failure/format.type';
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { applyGifDisposal } from './apply-gif-disposal';
import { GIF_NO_CONTROL } from './gif-no-control.constants';
import { GIF_DISPOSAL } from './gif-disposal.constants';
import { GIF_LIMITS } from './gif-limits.constants';
import type { GifDecodeState, GifDescriptor } from './gif.type';
import { paintGifFrame } from './paint-gif-frame';

const addGifFrame = (
  state: GifDecodeState,
  descriptor: GifDescriptor,
  indices: Uint8Array,
): FormatFailure | undefined => {
  const { canvas, screen, frames } = state;
  const pixels = screen.width * screen.height;
  if (frames.length >= GIF_LIMITS.MAX_FRAMES || (frames.length + 1) * pixels > GIF_LIMITS.MAX_TOTAL_PIXELS) {
    return formatFail(FORMAT_ERROR_CODE.GIF_TOO_LARGE, 'The animation holds too many frames');
  }
  applyGifDisposal(state);
  const control = state.control ?? GIF_NO_CONTROL;
  const backup = control.disposal === GIF_DISPOSAL.PREVIOUS ? Uint8ClampedArray.from(canvas) : undefined;
  paintGifFrame({ data: canvas, width: screen.width, height: screen.height }, descriptor, indices, control.transparent);
  const delayMs = Math.max(1, control.delayCs) * GIF_LIMITS.MS_PER_CS;
  frames.push({ data: Uint8ClampedArray.from(canvas), delayMs });
  const { x, y, width, height } = descriptor;
  state.pending = { method: control.disposal, x, y, width, height, backup };
  state.control = undefined;
  return undefined;
};

export { addGifFrame };
