/* @layer core @kind logic */
import { ERROR_CODE, fail } from '@bxel/document';
import type { Sprite } from '@bxel/document';

const checkSizable = (sprite: Sprite, instead: string): void => {
  if (sprite.role === 'tile') {
    throw fail(ERROR_CODE.INVALID_OPTION, `Sprite "${sprite.name}" is a tile and keeps the size of its tileset.`);
  }
  if (sprite.role === 'frame') {
    throw fail(ERROR_CODE.INVALID_OPTION, `Sprite "${sprite.name}" is a frame of an animation. ${instead}`);
  }
};

export { checkSizable };
