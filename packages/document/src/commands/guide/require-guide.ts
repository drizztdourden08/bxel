/* @layer core @kind logic */
import type { Sprite } from '../../model/sprite.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { guideLine } from './guide-line';
import type { GuideAxis } from './guide.type';

const requireGuide = (sprite: Sprite, axis: GuideAxis, position: number, path: string): void => {
  if (!guideLine(sprite, axis).includes(position)) {
    throw fail(ERROR_CODE.TARGET_NOT_FOUND, `There is no ${axis} guide at ${position}.`, { path });
  }
};

export { requireGuide };
