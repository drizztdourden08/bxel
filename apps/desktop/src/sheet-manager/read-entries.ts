/* @layer renderer-app @kind logic */
import { SPRITE_DRAG_TYPE } from '../sheet/sprite-drag.constants';
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
  const many = parse(transfer.getData(ASSETS_DRAG_TYPE));
  if (many.length > 0) return many;
  const id = transfer.getData(SPRITE_DRAG_TYPE);
  return id === '' ? [] : [{ kind: 'sprite', assetId: id, path: '' }];
};

export { readEntries };
