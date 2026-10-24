/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import { useTimelineStore } from '../stores/useTimelineStore';
import { moveFrames } from './move-frames';

const dragFrame = (from: number, to: number): boolean => {
  const target = currentTarget();
  const dragged = target?.sprite.frames[from];
  if (!dragged) return false;
  const held = useTimelineStore.getState().selection.frames.includes(dragged.id);
  return moveFrames(to - from, held ? undefined : [dragged.id]);
};

export { dragFrame };
