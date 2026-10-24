/* @layer renderer-app @kind logic */
import type { FrameId } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { useTimelineStore } from '../stores/useTimelineStore';
import { selectFrames } from './select-frames';

const goToFrame = (frameId: FrameId, extend = false): void => {
  const target = currentTarget();
  if (!target) return;
  const timeline = useTimelineStore.getState();
  const key = { layerId: target.layerId, frameId };
  timeline.select(selectFrames(target.sprite, timeline.selection, key, extend), frameId);
};

export { goToFrame };
