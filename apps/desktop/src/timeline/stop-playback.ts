/* @layer renderer-app @kind logic */
import { useTimelineStore } from '../stores/useTimelineStore';
import { currentFocus } from './current-focus';

const stopPlayback = (): void => {
  const state = useTimelineStore.getState();
  if (!state.playing) return;
  state.pause();
  const start = state.playStart;
  const focus = currentFocus();
  if (state.rewind && start !== null && focus?.animation.frames.some((frame) => frame.id === start)) state.setPlayhead(start);
};

export { stopPlayback };
