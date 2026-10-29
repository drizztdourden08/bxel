/* @layer renderer-app @kind logic */
import type { Artwork, Sprite } from '@bxel/document';

const stayingSprites = (artwork: Artwork, sources: readonly Sprite[], keep: boolean): Sprite[] => {
  const gone = new Set(keep ? [] : sources.map((sprite) => sprite.id));
  return artwork.sprites.filter((sprite) => !gone.has(sprite.id));
};

export { stayingSprites };
