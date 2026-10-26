/* @layer renderer-app @kind logic */
import type { Animation, Tileset } from '@bxel/document';
import { TILE_ANIMATION_TEXT } from './tile-animation.constants';

const animationFit = (tileset: Tileset, animation: Animation): string | null => {
  if (animation.width !== tileset.tileWidth || animation.height !== tileset.tileHeight) {
    return TILE_ANIMATION_TEXT.sizeIssue(animation.name, animation.width, animation.height, `${tileset.tileWidth} by ${tileset.tileHeight}`);
  }
  return animation.bankId === tileset.bankId ? null : TILE_ANIMATION_TEXT.paletteIssue(animation.name);
};

export { animationFit };
