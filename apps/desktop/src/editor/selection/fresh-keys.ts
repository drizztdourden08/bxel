/* @layer renderer-app @kind logic */
import type { ModifierKeys } from './mode-of.type';
import type { DragKeys } from './selection.type';

const freshKeys = (event: ModifierKeys): DragKeys => ({ shiftAtPress: event.shiftKey, altAtPress: event.altKey, shiftReleased: false, altReleased: false });

export { freshKeys };
