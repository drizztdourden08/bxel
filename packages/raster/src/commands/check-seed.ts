/* @layer core @kind logic */
import { ERROR_CODE, fail, requireSprite } from '@bxel/document';
import { foldPoint } from '../fold-point';
import { targetIssue } from './target-issue';
import type { SeedRules } from './seed-rules.type';

const checkSeed = ({ artwork, sprites, seed, wrap }: SeedRules): void => {
  const outside = sprites
    .filter((spriteId) => {
      const sprite = requireSprite(artwork, spriteId);
      const at = foldPoint(seed, sprite, wrap);
      return at.x < 0 || at.y < 0 || at.x >= sprite.width || at.y >= sprite.height;
    })
    .map((spriteId) => targetIssue(spriteId, 'the seed point is outside the sprite'));
  if (outside.length > 0) {
    throw fail(ERROR_CODE.OUT_OF_BOUNDS, 'The seed point must lie inside every target sprite.', { details: outside });
  }
};

export { checkSeed };
