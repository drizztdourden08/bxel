/* @layer renderer-app @kind logic */
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { goToFrame } from './go-to-frame';

const applyMenuSelection = (selection: ReadonlySet<string> | undefined): void => {
  const focus = currentFocus();
  if (!focus || selection?.size !== 1) return;
  const only = focus.animation.frames.find((frame) => selection.has(frame.id))?.id;
  if (only !== undefined && !currentSelection(focus).includes(only)) goToFrame(only);
};

export { applyMenuSelection };
