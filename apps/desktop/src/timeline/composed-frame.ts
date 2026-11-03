/* @layer renderer-app @kind logic */
import type { AnimFlip, AnimFrameId, Animation, Artwork } from '@bxel/document';
import type { FrameImage } from '../sheet/sheet.type';
import { composedRgba } from './composed-rgba';

const composedFrame = (artwork: Artwork, animation: Animation, frameId: AnimFrameId, flip: AnimFlip | null = null): FrameImage | null => {
  const rgba = composedRgba(artwork, animation, frameId, flip);
  return rgba ? { width: animation.width, height: animation.height, rgba } : null;
};

export { composedFrame };
