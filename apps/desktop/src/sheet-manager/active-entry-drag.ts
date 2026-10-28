/* @layer renderer-app @kind logic */
import { useEntryDragStore } from '../stores/useEntryDragStore';
import type { DragState } from './drag-payload.type';

const activeEntryDrag = (): DragState | null => useEntryDragStore.getState().active;

export { activeEntryDrag };
