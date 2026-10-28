/* @layer renderer-app @kind logic */
import type { ModifierKeys } from './mode-of.type';
import type { DragKeys, ShapeHold } from './selection.type';

const pressedKeys = (event: ModifierKeys): Pick<DragKeys, 'shiftAtPress' | 'altAtPress'> => ({ shiftAtPress: event.shiftKey, altAtPress: event.altKey });

const freshKeys = (event: ModifierKeys): DragKeys => ({ ...pressedKeys(event), shiftReleased: false, altReleased: false });

const shapeHold = (keys: DragKeys, event: ModifierKeys): ShapeHold => {
  if (!event.shiftKey) keys.shiftReleased = true;
  if (!event.altKey) keys.altReleased = true;
  return {
    square: event.shiftKey && (!keys.shiftAtPress || keys.shiftReleased),
    centre: event.altKey && (!keys.altAtPress || keys.altReleased),
  };
};

export { freshKeys, shapeHold };
