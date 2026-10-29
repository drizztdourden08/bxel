/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';

const freeSpriteName = (artwork: Artwork, base: string): string => {
  const taken = new Set(artwork.sprites.map((sprite) => sprite.name));
  let count = 1;
  while (taken.has(count === 1 ? base : `${base} ${count}`)) count += 1;
  return count === 1 ? base : `${base} ${count}`;
};

export { freeSpriteName };
