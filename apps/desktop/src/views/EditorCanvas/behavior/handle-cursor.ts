/* @layer renderer-app @kind logic */
import type { Handle } from '../../../editor/transform/transform.type';
import { CORNER_CURSORS, EDGE_CURSORS, HANDLE_CURSORS } from '../EditorCanvas.constants';

const handleCursor = (handle: Handle | null): string => {
  if (!handle) return '';
  if (handle.kind === 'corner') return CORNER_CURSORS[handle.index % 2] ?? '';
  if (handle.kind === 'edge') return EDGE_CURSORS[handle.index % 2] ?? '';
  return HANDLE_CURSORS[handle.kind] ?? '';
};

export { handleCursor };
