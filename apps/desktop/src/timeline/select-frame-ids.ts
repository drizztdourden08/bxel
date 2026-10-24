/* @layer renderer-app @kind logic */
import type { FrameId, LayerId } from '@bxel/document';
import { useTimelineStore } from '../stores/useTimelineStore';

const selectFrameIds = (layerId: LayerId, frames: readonly FrameId[], current: FrameId | undefined): void => {
  const [first] = frames;
  if (first === undefined) return;
  useTimelineStore.getState().select({ frames, layers: [], anchor: { layerId, frameId: first } }, current ?? first);
};

export { selectFrameIds };
