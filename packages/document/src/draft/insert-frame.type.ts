/* @layer core @kind types */
import type { FrameId, SpriteId } from '../model/ids.type';
import type { Frame } from '../model/sprite.type';

type InsertFrameInput = {
  readonly spriteId: SpriteId;
  readonly frame: Frame;
  readonly at: number;
  readonly copyOf?: FrameId;
  readonly linked?: boolean;
};

export type { InsertFrameInput };
