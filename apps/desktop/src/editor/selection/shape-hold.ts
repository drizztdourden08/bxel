/* @layer renderer-app @kind logic */
import type { ModifierKeys } from './mode-of.type';
import type { DragKeys, ShapeHold } from './selection.type';

const shapeHold = (keys: DragKeys, event: ModifierKeys): ShapeHold => {
  if (!event.shiftKey) keys.shiftReleased = true;
  if (!event.altKey) keys.altReleased = true;
  return {
    square: event.shiftKey && (!keys.shiftAtPress || keys.shiftReleased),
    centre: event.altKey && (!keys.altAtPress || keys.altReleased),
  };
};

export { shapeHold };
