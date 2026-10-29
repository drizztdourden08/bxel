/* @layer renderer-app @kind logic */
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { setDurationOf } from './set-duration-of';

const setDuration = (durationMs: number): boolean => {
  const focus = currentFocus();
  return focus !== null && setDurationOf(currentSelection(focus), durationMs);
};

export { setDuration };
