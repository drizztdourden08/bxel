/* @layer core @kind logic */
import type { SpriteId } from '../../model/ids.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const targetSprite = (sprites: readonly SpriteId[]): SpriteId => {
  const [spriteId] = sprites;
  if (!spriteId) throw fail(ERROR_CODE.TARGET_NOT_FOUND, 'No sprite was targeted.');
  return spriteId;
};

export { targetSprite };
