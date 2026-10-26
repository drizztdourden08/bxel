/* @layer core @kind logic */
import type { Sprite } from '../../model/sprite.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { guideLimit } from './guide-limit';
import type { GuideAxis } from './guide.type';

const checkGuide = (sprite: Sprite, axis: GuideAxis, position: number, path: string): void => {
  if (position > guideLimit(sprite, axis)) {
    throw fail(ERROR_CODE.OUT_OF_BOUNDS, 'A guide lies on the sprite, between 0 and its size.', { path });
  }
};

export { checkGuide };
