/* @layer renderer-app @kind logic */
import { composeAnimationFrame } from '@bxel/document';
import type { AnimFlip } from '@bxel/document';
import type { ExportFrame } from '@bxel/formats';
import type { AnimationWorld } from './animation-export.type';

const animationFrameOf = ({ artwork, animation }: AnimationWorld, index: number, flip: AnimFlip | null): ExportFrame[] => {
  const frame = animation.frames[index];
  return frame ? [{ layers: [composeAnimationFrame(artwork, animation, frame.id, flip)], durationMs: frame.durationMs }] : [];
};

export { animationFrameOf };
