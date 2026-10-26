/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { Animation } from '../model/animation.type';
import { MAX_ANIMATION_FRAMES } from '../model/animation.constants';
import type { Artwork } from '../model/artwork.type';
import { findBank } from '../read/find-bank';
import { checkSize } from '../validate/check-size';
import { checkAnimFrame } from './check-anim-frame';
import { checkAnimTags } from './check-anim-tags';

const checkFrames = (artwork: Artwork, animation: Animation): void => {
  const count = animation.frames.length;
  if (count < 1 || count > MAX_ANIMATION_FRAMES) {
    throw fail(ERROR_CODE.REFERENCE_BROKEN, `Animation "${animation.name}" holds 1 to ${MAX_ANIMATION_FRAMES} frames.`);
  }
  if (new Set(animation.frames.map((frame) => frame.id)).size !== count) {
    throw fail(ERROR_CODE.REFERENCE_BROKEN, `Animation "${animation.name}" repeats a frame id.`);
  }
  for (const [index, frame] of animation.frames.entries()) checkAnimFrame(artwork, animation, frame, index);
};

const checkAnimation = (artwork: Artwork, animation: Animation): void => {
  checkSize(animation);
  if (!findBank(artwork, animation.bankId)) {
    throw fail(ERROR_CODE.REFERENCE_BROKEN, `Animation "${animation.name}" names a palette that does not exist.`);
  }
  checkFrames(artwork, animation);
  checkAnimTags(animation);
};

export { checkAnimation };
