/* @layer renderer-app @kind types */
import type { FrameId, SpriteId } from '@bxel/document';

type CurrentPick = {
  readonly spriteId: SpriteId | null;
  readonly frameId: FrameId | null;
};

export type { CurrentPick };
