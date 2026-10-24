/* @layer core @kind logic */
import { ERROR_CODE, fail, requireSprite } from '@bxel/document';
import type { Artwork, SpriteId } from '@bxel/document';
import type { Point } from '../geometry.type';
import { targetIssue } from './target-issue';

const checkSeed = (artwork: Artwork, sprites: readonly SpriteId[], seed: Point): void => {
  const outside = sprites
    .filter((spriteId) => {
      const sprite = requireSprite(artwork, spriteId);
      return seed.x < 0 || seed.y < 0 || seed.x >= sprite.width || seed.y >= sprite.height;
    })
    .map((spriteId) => targetIssue(spriteId, 'the seed point is outside the sprite'));
  if (outside.length > 0) {
    throw fail(ERROR_CODE.OUT_OF_BOUNDS, 'The seed point must lie inside every target sprite.', { details: outside });
  }
};

export { checkSeed };
