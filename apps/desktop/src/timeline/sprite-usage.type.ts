/* @layer renderer-app @kind types */
import type { AnimFrameId, AnimationId } from '@bxel/document';

interface SpriteUse {
  animationId: AnimationId;
  name: string;
  frames: readonly { id: AnimFrameId; number: number }[];
}

export type { SpriteUse };
