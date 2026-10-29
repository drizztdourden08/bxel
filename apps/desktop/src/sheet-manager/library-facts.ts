/* @layer renderer-app @kind logic */
import type { Artwork, Sheet } from '@bxel/document';
import { listSprites } from '../sheet/list-sprites';
import type { SpriteFacts } from './manager.type';
import { spriteFacts } from './sprite-facts';

const libraryFacts = (artwork: Artwork, sheet: Sheet | null): SpriteFacts[] => {
  const placed = new Set((sheet?.entries ?? []).map((entry) => entry.spriteId));
  return listSprites(artwork)
    .filter((sprite) => !placed.has(sprite.id))
    .map((sprite) => spriteFacts(artwork, sprite, sheet));
};

export { libraryFacts };
