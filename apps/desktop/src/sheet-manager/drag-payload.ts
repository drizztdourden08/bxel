/* @layer renderer-app @kind logic */
import { SPRITE_DRAG_TYPE } from '../sheet/sprite-drag.constants';
import { useEntryDragStore } from '../stores/useEntryDragStore';
import { ASSETS_DRAG_TYPE } from './drag-payload.constants';
import type { DragEntry, DragSource } from './drag-payload.type';

const startEntryDrag = (transfer: DataTransfer, source: DragSource, entries: readonly DragEntry[]): void => {
  useEntryDragStore.getState().begin({ source, entries });
  transfer.setData(ASSETS_DRAG_TYPE, JSON.stringify(entries));
  const first = entries.find((entry) => entry.kind === 'sprite');
  if (first) transfer.setData(SPRITE_DRAG_TYPE, first.assetId);
  transfer.effectAllowed = 'copyMove';
};

export { startEntryDrag };
