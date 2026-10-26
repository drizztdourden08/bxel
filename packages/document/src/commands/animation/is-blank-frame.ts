/* @layer core @kind logic */
import type { AnimFrame } from '../../model/animation.type';
import type { Artwork } from '../../model/artwork.type';
import { findSprite } from '../../read/find-sprite';

const isBlankFrame = (artwork: Artwork, frame: AnimFrame): boolean => {
  if (frame.spriteId === null) return true;
  const sprite = findSprite(artwork, frame.spriteId);
  return sprite?.role === 'frame' && Object.values(sprite.cels).every((cel) => cel.pixels.every((value) => value === 0));
};

export { isBlankFrame };
