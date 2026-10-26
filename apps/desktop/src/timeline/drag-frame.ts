/* @layer renderer-app @kind logic */
import { useTimelineStore } from '../stores/useTimelineStore';
import { currentFocus } from './current-focus';
import { moveFrames } from './move-frames';

const dragFrame = (from: number, to: number): boolean => {
  const dragged = currentFocus()?.animation.frames[from];
  if (!dragged) return false;
  const held = useTimelineStore.getState().selection.frames.includes(dragged.id);
  return moveFrames(to - from, held ? undefined : [dragged.id]);
};

export { dragFrame };
