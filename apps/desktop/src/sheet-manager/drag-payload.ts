/* @layer renderer-app @kind logic */
import { SPRITE_DRAG_TYPE } from '../sheet/sprite-drag.constants';
import { ASSETS_DRAG_TYPE } from './drag-payload.constants';
import type { DragEntry, DragSource, DragState } from './drag-payload.type';

let active: DragState | null = null;

const startEntryDrag = (transfer: DataTransfer, source: DragSource, entries: readonly DragEntry[]): void => {
  active = { source, entries };
  transfer.setData(ASSETS_DRAG_TYPE, JSON.stringify(entries));
  const first = entries.find((entry) => entry.kind === 'sprite');
  if (first) transfer.setData(SPRITE_DRAG_TYPE, first.assetId);
  transfer.effectAllowed = 'copyMove';
};

const endEntryDrag = (): void => {
  active = null;
};

const activeEntryDrag = (): DragState | null => active;

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

const carriesEntries = (transfer: DataTransfer | null): boolean =>
  transfer !== null && (transfer.types.includes(ASSETS_DRAG_TYPE) || transfer.types.includes(SPRITE_DRAG_TYPE));

const readEntries = (transfer: DataTransfer): DragEntry[] => {
  if (active) return [...active.entries];
  const many = parse(transfer.getData(ASSETS_DRAG_TYPE));
  if (many.length > 0) return many;
  const id = transfer.getData(SPRITE_DRAG_TYPE);
  return id === '' ? [] : [{ kind: 'sprite', assetId: id, path: '' }];
};

export { activeEntryDrag, carriesEntries, endEntryDrag, readEntries, startEntryDrag };
