/* @layer renderer-app @kind logic */
import type { AnimFlip, AnimFrameId, Animation, Artwork } from '@bxel/document';
import { composedRgba } from './composed-rgba';

const composedImage = (artwork: Artwork, animation: Animation, frameId: AnimFrameId, flip: AnimFlip | null = null): ImageData | null => {
  const data = composedRgba(artwork, animation, frameId, flip);
  return data ? new ImageData(data, animation.width, animation.height) : null;
};

export { composedImage };
