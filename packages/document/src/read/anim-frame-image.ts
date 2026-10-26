/* @layer core @kind logic */
import type { AnimFrame } from '../model/animation.type';
import type { Artwork } from '../model/artwork.type';
import { readRect } from '../pixels/read-rect';
import type { AnimFrameImage } from './anim-frame-image.type';
import { findSprite } from './find-sprite';
import { flattenFrame } from './flatten-frame';

const animFrameImage = (artwork: Artwork, frame: AnimFrame): AnimFrameImage | null => {
  const sprite = frame.spriteId === null ? undefined : findSprite(artwork, frame.spriteId);
  const first = sprite?.frames[0];
  if (!sprite || !first) return null;
  const pixels = flattenFrame(sprite, first.id);
  if (!frame.clip) return { width: sprite.width, height: sprite.height, pixels };
  return { width: frame.clip.width, height: frame.clip.height, pixels: readRect(pixels, sprite.width, frame.clip) };
};

export { animFrameImage };
