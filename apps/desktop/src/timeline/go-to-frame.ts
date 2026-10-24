/* @layer renderer-app @kind logic */
import type { FrameId } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { useTimelineStore } from '../stores/useTimelineStore';
import { addFramePick } from './add-frame-pick';
import { currentSelection } from './current-selection';
import { selectFrames } from './select-frames';

const goToFrame = (frameId: FrameId, extend = false, add = false): void => {
  const target = currentTarget();
  if (!target) return;
  const timeline = useTimelineStore.getState();
  const key = { layerId: target.layerId, frameId };
  const next = add
    ? addFramePick(target.sprite, currentSelection(target).frames, timeline.selection.layers, key)
    : selectFrames(target.sprite, timeline.selection, key, extend);
  timeline.select(next, frameId);
};

export { goToFrame };
