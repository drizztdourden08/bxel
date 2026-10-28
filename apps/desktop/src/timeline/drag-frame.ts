/* @layer renderer-app @kind logic */
import { useTimelineStore } from '../stores/useTimelineStore';
import { copyFramesAt } from './copy-frames-at';
import { currentFocus } from './current-focus';
import { moveFrames } from './move-frames';
import type { DragMode } from './drag-mode.type';

const dragFrame = (from: number, to: number, mode: DragMode = 'move'): boolean => {
  const dragged = currentFocus()?.animation.frames[from];
  if (!dragged) return false;
  const held = useTimelineStore.getState().selection.frames.includes(dragged.id);
  const only = held ? undefined : [dragged.id];
  if (mode === 'move') return moveFrames(to - from, only);
  return copyFramesAt(to > from ? to + 1 : to, mode === 'link', only);
};

export { dragFrame };
