/* @layer core @kind logic */
import type { ApngAnimation } from '../animation/animation.type';
import type { FormatFailure } from '../failure/format.type';
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { APNG_LIMITS } from './apng-limits.constants';

const bad = (message: string): FormatFailure =>
  formatFail(FORMAT_ERROR_CODE.APNG_INVALID_INPUT, message);

const checkApngAnimation = (animation: ApngAnimation): FormatFailure | undefined => {
  const { frames, loops } = animation;
  if (frames.length < 1 || frames.length > APNG_LIMITS.MAX_FRAMES) {
    return bad(`An animation needs 1 to ${APNG_LIMITS.MAX_FRAMES} frames`);
  }
  if (!Number.isInteger(loops) || loops < 0 || loops > APNG_LIMITS.MAX_LOOPS) {
    return bad('Loops must be a non-negative integer');
  }
  for (const frame of frames) {
    if (!Number.isInteger(frame.delayMs) || frame.delayMs < 1 || frame.delayMs > APNG_LIMITS.MAX_DELAY_MS) {
      return bad(`Frame delay must be 1 to ${APNG_LIMITS.MAX_DELAY_MS} ms`);
    }
  }
  return undefined;
};

export { checkApngAnimation };
