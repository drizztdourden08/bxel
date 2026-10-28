/* @layer renderer-app @kind logic */
import { useTimelineStore } from '../stores/useTimelineStore';
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { fitThumb } from './track-layout';
import { END_GUTTER_PX } from './track-layout.constants';

const fitPick = (available: number): void => {
  const focus = currentFocus();
  if (!focus) return;
  const picked = currentSelection(focus);
  const state = useTimelineStore.getState();
  const durations = focus.animation.frames.filter((frame) => picked.includes(frame.id)).map((frame) => frame.durationMs);
  state.setZoom(fitThumb(durations, Math.max(0, available - END_GUTTER_PX), state.timeMode));
};

export { fitPick };
