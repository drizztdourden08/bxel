/* @layer renderer-app @kind logic */
import type { AnimFrameId } from '@bxel/document';
import { currentFocus } from './current-focus';
import { setDurations } from './set-durations';

const scaleDurationsOf = (ids: readonly AnimFrameId[], factor: number): boolean => {
  const focus = currentFocus();
  if (!focus || !Number.isFinite(factor) || factor <= 0) return false;
  const durations = new Map(focus.animation.frames.filter((frame) => ids.includes(frame.id)).map((frame) => [frame.id, frame.durationMs * factor]));
  return setDurations(durations);
};

export { scaleDurationsOf };
