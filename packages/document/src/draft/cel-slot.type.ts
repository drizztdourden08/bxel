/* @layer core @kind types */
import type { FrameId, LayerId, SpriteId } from '../model/ids.type';

type CelSlot = {
  readonly spriteId: SpriteId;
  readonly layerId: LayerId;
  readonly frameId: FrameId;
};

export type { CelSlot };
