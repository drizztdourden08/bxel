/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';
import { isFormatFailure } from '../failure/is-format-failure';
import { APNG_OP } from './apng-op.constants';
import type { ApngFrameData, ApngLayout, ApngRenderState } from './apng.type';
import { decodeApngFrame } from './decode-apng-frame';
import { disposeApngFrame } from './dispose-apng-frame';
import { paintApngFrame } from './paint-apng-frame';

const renderApngFrame = (
  state: ApngRenderState,
  layout: ApngLayout,
  frame: ApngFrameData,
): FormatFailure | undefined => {
  const { x, y, width, height, blend, delayMs } = frame.control;
  if (width < 1 || height < 1 || x + width > state.width || y + height > state.height) {
    return formatFail(FORMAT_ERROR_CODE.APNG_INVALID_DATA, 'A frame lies outside the canvas');
  }
  const decoded = decodeApngFrame(layout, frame);
  if (isFormatFailure(decoded)) return decoded;
  disposeApngFrame(state);
  const first = state.frames.length === 0;
  const requested = frame.control.dispose;
  const dispose = first && requested === APNG_OP.DISPOSE_PREVIOUS ? APNG_OP.DISPOSE_BACKGROUND : requested;
  const backup = dispose === APNG_OP.DISPOSE_PREVIOUS ? Uint8ClampedArray.from(state.canvas) : undefined;
  const region = { x, y, width, height };
  paintApngFrame({ data: state.canvas, width: state.width, height: state.height }, region, decoded.data, blend);
  state.frames.push({ data: Uint8ClampedArray.from(state.canvas), delayMs });
  state.pending = { dispose, region, backup };
  return undefined;
};

export { renderApngFrame };
