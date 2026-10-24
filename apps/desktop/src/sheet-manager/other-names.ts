/* @layer renderer-app @kind logic */
import type { Artwork, Sprite } from '@bxel/document';

const otherNames = (artwork: Artwork, sources: readonly Sprite[], keep: boolean): string[] => {
  const gone = new Set(keep ? [] : sources.map((sprite) => sprite.id));
  return artwork.sprites.filter((sprite) => !gone.has(sprite.id)).map((sprite) => sprite.name);
};

export { otherNames };
