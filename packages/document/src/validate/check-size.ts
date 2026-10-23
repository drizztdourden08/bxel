/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { Size } from '../model/geometry.type';
import { MAX_SPRITE_SIZE, MIN_SPRITE_SIZE } from '../model/limits.constants';

const inRange = (value: number): boolean => Number.isInteger(value) && value >= MIN_SPRITE_SIZE && value <= MAX_SPRITE_SIZE;

const checkSize = (size: Size): void => {
  if (!inRange(size.width) || !inRange(size.height)) {
    throw fail(ERROR_CODE.SIZE_OUT_OF_RANGE, `A sprite is ${MIN_SPRITE_SIZE} to ${MAX_SPRITE_SIZE} pixels on each side.`);
  }
};

export { checkSize };
