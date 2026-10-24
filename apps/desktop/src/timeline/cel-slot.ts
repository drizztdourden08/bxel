/* @layer renderer-app @kind logic */
import type { FrameId, LayerId } from '@bxel/document';
import { idRef } from './id-ref';

const celSlot = (layerId: LayerId, frameId: FrameId): { layer: ReturnType<typeof idRef>; frame: ReturnType<typeof idRef> } => ({
  layer: idRef(layerId),
  frame: idRef(frameId),
});

export { celSlot };
