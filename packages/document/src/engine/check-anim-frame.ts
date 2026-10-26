/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { AnimFrame, Animation } from '../model/animation.type';
import type { Artwork } from '../model/artwork.type';
import type { Rect, Size } from '../model/geometry.type';
import { MAX_DURATION_MS, MIN_DURATION_MS } from '../model/limits.constants';
import { findSprite } from '../read/find-sprite';

const broken = (animation: Animation, index: number, message: string) =>
  fail(ERROR_CODE.REFERENCE_BROKEN, `Frame ${index + 1} of animation "${animation.name}" ${message}`);

const insideSprite = (clip: Rect, sprite: Size): boolean =>
  clip.x >= 0 && clip.y >= 0 && clip.x + clip.width <= sprite.width && clip.y + clip.height <= sprite.height;

const checkTiming = (animation: Animation, frame: AnimFrame, index: number): void => {
  const valid = Number.isInteger(frame.durationMs) && frame.durationMs >= MIN_DURATION_MS && frame.durationMs <= MAX_DURATION_MS;
  if (!valid) throw broken(animation, index, `needs a duration of ${MIN_DURATION_MS} to ${MAX_DURATION_MS} ms.`);
  if (!Number.isInteger(frame.offset.x) || !Number.isInteger(frame.offset.y)) throw broken(animation, index, 'needs a whole pixel offset.');
};

const checkAnimFrame = (artwork: Artwork, animation: Animation, frame: AnimFrame, index: number): void => {
  checkTiming(animation, frame, index);
  if (frame.spriteId === null) {
    if (frame.clip !== null) throw broken(animation, index, 'is empty and cannot have a clip.');
    return;
  }
  const sprite = findSprite(artwork, frame.spriteId);
  if (!sprite || sprite.role === 'tile') throw broken(animation, index, 'needs a sprite of the file.');
  if (sprite.bankId !== animation.bankId) {
    throw fail(ERROR_CODE.PALETTE_MISMATCH, `Frame ${index + 1} of animation "${animation.name}" uses sprite "${sprite.name}" from another palette.`);
  }
  if (frame.clip && !insideSprite(frame.clip, sprite)) throw broken(animation, index, `has a clip outside sprite "${sprite.name}".`);
};

export { checkAnimFrame };
