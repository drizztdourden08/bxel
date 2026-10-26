/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import { useTimelineStore } from '../stores/useTimelineStore';
import { goToFrame } from './go-to-frame';

const playFrom = (frameId: string): void => {
  const frame = currentTarget()?.sprite.frames.find((each) => each.id === frameId);
  if (!frame) return;
  goToFrame(frame.id);
  useTimelineStore.getState().play();
};

export { playFrom };
