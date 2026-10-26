/* @layer renderer-app @kind logic */
import type { Animation, Artwork } from '@bxel/document';
import type { Eligible } from './eligible-sprites.type';

const eligibleSprites = (artwork: Artwork, animation: Animation): Eligible => {
  const stills = artwork.sprites.filter((sprite) => sprite.role === 'sprite');
  const sprites = stills.filter((sprite) => sprite.bankId === animation.bankId);
  return { sprites, other: stills.length - sprites.length };
};

export { eligibleSprites };
