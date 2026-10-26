/* @layer renderer-app @kind logic */
import { animFrameOrigin } from '@bxel/document';
import type { AnimFrame, Animation, Artwork, Point } from '@bxel/document';

const canvasOrigin = (artwork: Artwork, animation: Animation, frame: AnimFrame): Point => {
  const origin = animFrameOrigin(artwork, animation, frame);
  return { x: (frame.clip?.x ?? 0) - origin.x, y: (frame.clip?.y ?? 0) - origin.y };
};

export { canvasOrigin };
