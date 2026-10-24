/* @layer renderer-app @kind types */
import type { FrameId, SpriteId, TilemapId } from '@bxel/document';

type CurrentPick = {
  readonly spriteId: SpriteId | null;
  readonly frameId: FrameId | null;
  readonly tilemapId?: TilemapId | null;
};

export type { CurrentPick };
