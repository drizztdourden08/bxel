/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { useTimelineStore } from '../stores/useTimelineStore';
import { currentFocus } from './current-focus';
import { goToFrame } from './go-to-frame';
import { TIMELINE_SAY } from './timeline-say.constants';

const playFrom = (frameId: string): void => {
  const frames = currentFocus()?.animation.frames ?? [];
  const frame = frames.find((each) => each.id === frameId);
  if (!frame) return;
  goToFrame(frame.id);
  useTimelineStore.getState().play();
  announce(TIMELINE_SAY.playingFrom(frames.indexOf(frame) + 1));
};

export { playFrom };
