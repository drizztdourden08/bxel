/* @layer renderer-app @kind logic */
import { useTimelineStore } from '../stores/useTimelineStore';
import { currentFocus } from './current-focus';
import { goToFrame } from './go-to-frame';

const playFrom = (frameId: string): void => {
  const frame = currentFocus()?.animation.frames.find((each) => each.id === frameId);
  if (!frame) return;
  goToFrame(frame.id);
  useTimelineStore.getState().play();
};

export { playFrom };
