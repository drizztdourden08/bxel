/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { useTimelineStore } from '../stores/useTimelineStore';
import { currentFocus } from './current-focus';
import { TIMELINE_SAY } from './timeline-say.constants';

const stopPlayback = (): void => {
  const state = useTimelineStore.getState();
  if (!state.playing) return;
  state.pause();
  const start = state.playStart;
  const focus = currentFocus();
  const order = focus?.animation.frames.map((frame) => frame.id) ?? [];
  if (state.rewind && start !== null && order.includes(start)) {
    state.setPlayhead(start);
    announce(TIMELINE_SAY.rewound(order.indexOf(start) + 1));
    return;
  }
  const at = order.indexOf(state.frameId ?? '');
  if (at >= 0) announce(TIMELINE_SAY.paused(at + 1));
};

export { stopPlayback };
