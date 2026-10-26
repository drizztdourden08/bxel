/* @layer renderer-app @kind logic */
import type { AnimFrameId } from '@bxel/document';
import { useTimelineStore } from '../stores/useTimelineStore';
import type { AnimationFocus } from './timeline.type';

const currentSelection = (focus: AnimationFocus): readonly AnimFrameId[] => {
  const picked = useTimelineStore.getState().selection.frames;
  const frames = focus.animation.frames.filter((frame) => picked.includes(frame.id)).map((frame) => frame.id);
  return frames.length > 0 ? frames : [focus.frame.id];
};

export { currentSelection };
