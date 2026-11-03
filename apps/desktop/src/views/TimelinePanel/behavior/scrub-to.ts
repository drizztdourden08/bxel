/* @layer renderer-app @kind logic */
import type { AnimFrame } from '@bxel/document';
import { useTimelineStore } from '../../../stores/useTimelineStore';

const scrubTo = (frames: readonly AnimFrame[], index: number): void => {
  const frame = frames[index];
  if (frame && frame.id !== useTimelineStore.getState().frameId) useTimelineStore.getState().setPlayhead(frame.id);
};

export { scrubTo };
