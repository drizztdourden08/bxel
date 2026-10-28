/* @layer renderer-app @kind logic */
import type { Artwork, Sheet } from '@bxel/document';
import { listSprites } from '../sheet/list-sprites';
import type { SpriteFacts } from './manager.type';
import { spriteFacts } from './sprite-facts';

const allFacts = (artwork: Artwork, sheet: Sheet | null): SpriteFacts[] => {
  if (!sheet) return [];
  const byId = new Map(listSprites(artwork).map((sprite) => [sprite.id, sprite] as const));
  return sheet.entries.flatMap((entry) => {
    const sprite = byId.get(entry.spriteId);
    return sprite ? [spriteFacts(artwork, sprite, sheet)] : [];
  });
};

export { allFacts };
