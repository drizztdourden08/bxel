/* @layer core @kind logic */
import type { GifAnimation } from '../animation/animation.type';
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';
import { isIntegerIn } from '../pixels/is-integer-in';
import { checkGifFrame } from './check-gif-frame';
import { GIF_LIMITS } from './gif-limits.constants';

const bad = (message: string): FormatFailure =>
  formatFail(FORMAT_ERROR_CODE.GIF_INVALID_INPUT, message);

const checkGifGeometry = (animation: GifAnimation, entries: number): FormatFailure | undefined => {
  const { width, height, transparentIndex } = animation;
  if (!isIntegerIn(width, 1, GIF_LIMITS.MAX_SIDE) || !isIntegerIn(height, 1, GIF_LIMITS.MAX_SIDE)) {
    return bad(`Width and height must be integers 1 to ${GIF_LIMITS.MAX_SIDE}`);
  }
  if (!isIntegerIn(entries, 1, GIF_LIMITS.MAX_COLORS)) return bad('Palette must hold 1 to 256 RGBA entries');
  if (transparentIndex !== null && !isIntegerIn(transparentIndex, 0, entries - 1)) {
    return bad('Transparent index is outside the palette');
  }
  return undefined;
};

const checkGifPlayback = (animation: GifAnimation): FormatFailure | undefined => {
  if (!isIntegerIn(animation.loops, 0, GIF_LIMITS.MAX_LOOPS)) {
    return bad(`Loops must be an integer 0 to ${GIF_LIMITS.MAX_LOOPS}`);
  }
  if (!isIntegerIn(animation.frames.length, 1, GIF_LIMITS.MAX_FRAMES)) {
    return bad(`An animation needs 1 to ${GIF_LIMITS.MAX_FRAMES} frames`);
  }
  return undefined;
};

const checkGifAnimation = (animation: GifAnimation): FormatFailure | undefined => {
  const entries = animation.palette.length / 4;
  const invalid = checkGifGeometry(animation, entries) ?? checkGifPlayback(animation);
  if (invalid) return invalid;
  const pixelCount = animation.width * animation.height;
  for (const frame of animation.frames) {
    const failure = checkGifFrame(frame, pixelCount, entries);
    if (failure) return failure;
  }
  return undefined;
};

export { checkGifAnimation };
