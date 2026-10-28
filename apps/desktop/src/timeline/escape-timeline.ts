/* @layer renderer-app @kind logic */
import { useTimelineStore } from '../stores/useTimelineStore';
import { currentFocus } from './current-focus';
import { selectFrameIds } from './select-frame-ids';

const escapeTimeline = (): void => {
  const state = useTimelineStore.getState();
  const focus = currentFocus();
  if (state.popover !== null) state.setPopover(null);
  else if (state.loopRange !== null) state.setLoopRange(null);
  else if (focus && state.selection.frames.length > 1) selectFrameIds([focus.frame.id]);
};

export { escapeTimeline };
