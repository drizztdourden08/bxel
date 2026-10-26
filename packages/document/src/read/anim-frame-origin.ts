/* @layer core @kind logic */
import type { AnimFrame, Animation } from '../model/animation.type';
import type { Point } from '../model/geometry.type';
import type { Artwork } from '../model/artwork.type';
import { animFramePivot } from './anim-frame-pivot';

const animFrameOrigin = (artwork: Artwork, animation: Animation, frame: AnimFrame): Point => {
  const pivot = animFramePivot(artwork, animation, frame);
  return {
    x: Math.floor((animation.anchor.x2 - pivot.x2) / 2) + frame.offset.x,
    y: Math.floor((animation.anchor.y2 - pivot.y2) / 2) + frame.offset.y,
  };
};

export { animFrameOrigin };
