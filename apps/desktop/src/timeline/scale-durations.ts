/* @layer renderer-app @kind logic */
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { scaleDurationsOf } from './scale-durations-of';

const scaleDurations = (factor: number): boolean => {
  const focus = currentFocus();
  return focus !== null && scaleDurationsOf(currentSelection(focus), factor);
};

export { scaleDurations };
