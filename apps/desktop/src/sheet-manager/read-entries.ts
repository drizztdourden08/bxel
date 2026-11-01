/* @layer renderer-app @kind logic */
import { activeEntryDrag } from './active-entry-drag';
import { ASSETS_DRAG_TYPE } from './drag-payload.constants';
import type { DragEntry } from './drag-payload.type';

const parse = (raw: string): DragEntry[] => {
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.flatMap((item): DragEntry[] => {
      if (typeof item !== 'object' || item === null) return [];
      const { kind, assetId, path, tagId } = item as Record<string, unknown>;
      if ((kind !== 'sprite' && kind !== 'animation') || typeof assetId !== 'string') return [];
      return [{ kind, assetId, path: typeof path === 'string' ? path : '', tagId: typeof tagId === 'string' ? tagId : null }];
    });
  } catch {
    return [];
  }
};

const readEntries = (transfer: DataTransfer): DragEntry[] => {
  const active = activeEntryDrag();
  if (active) return [...active.entries];
  return parse(transfer.getData(ASSETS_DRAG_TYPE));
};

export { readEntries };
