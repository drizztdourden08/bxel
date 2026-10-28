/* @layer renderer-app @kind logic */
import type { AnimFrameId } from '@bxel/document';
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { setDurations } from './set-duration';

const scaleDurationsOf = (ids: readonly AnimFrameId[], factor: number): boolean => {
  const focus = currentFocus();
  if (!focus || !Number.isFinite(factor) || factor <= 0) return false;
  const durations = new Map(focus.animation.frames.filter((frame) => ids.includes(frame.id)).map((frame) => [frame.id, frame.durationMs * factor]));
  return setDurations(durations);
};

const scaleDurations = (factor: number): boolean => {
  const focus = currentFocus();
  return focus !== null && scaleDurationsOf(currentSelection(focus), factor);
};

export { scaleDurations, scaleDurationsOf };
