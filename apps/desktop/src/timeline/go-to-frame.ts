/* @layer renderer-app @kind logic */
import type { AnimFrameId } from '@bxel/document';
import { useTimelineStore } from '../stores/useTimelineStore';
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { spanBetween } from './span-between';

const goToFrame = (frameId: AnimFrameId, extend = false, add = false): void => {
  const focus = currentFocus();
  if (!focus) return;
  const timeline = useTimelineStore.getState();
  const order = focus.animation.frames.map((frame) => frame.id);
  if (add) {
    const held = currentSelection(focus);
    const next = held.includes(frameId) && held.length > 1 ? held.filter((id) => id !== frameId) : [...held.filter((id) => id !== frameId), frameId];
    timeline.select({ frames: order.filter((id) => next.includes(id)), anchor: frameId }, frameId);
    return;
  }
  const anchor = extend && timeline.selection.anchor !== null ? timeline.selection.anchor : frameId;
  timeline.select({ frames: spanBetween(order, anchor, frameId), anchor }, frameId);
};

export { goToFrame };
