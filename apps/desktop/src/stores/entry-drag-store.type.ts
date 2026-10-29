/* @layer renderer-app @kind types */
import type { DragState } from '../sheet-manager/drag-payload.type';

interface EntryDragState {
  active: DragState | null;
  begin: (state: DragState) => void;
  finish: () => void;
}

export type { EntryDragState };
