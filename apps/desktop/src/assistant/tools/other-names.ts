/* @layer renderer-app @kind logic */
import type { Artwork, Sprite } from '@bxel/document';

const otherNames = (artwork: Artwork, targets: readonly Sprite[], copying: boolean): string[] => {
  const picked = new Set(copying ? [] : targets.map((sprite) => sprite.id));
  return artwork.sprites.filter((sprite) => !picked.has(sprite.id)).map((sprite) => sprite.name);
};

export { otherNames };
