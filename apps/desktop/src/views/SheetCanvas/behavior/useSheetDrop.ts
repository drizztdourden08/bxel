/* @layer renderer-app @kind hook */
import type { RefObject } from 'react';
import { DRAG_WHY } from '../../../sheet-manager/drag-payload.constants';
import { dropOnCanvas } from '../../../sheet-manager/drop-on-canvas';
import { useNoticeStore } from '../../../stores/useNoticeStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import { endEntryDrag } from '../../../sheet-manager/end-entry-drag';
import { carriesEntries } from '../../../sheet-manager/carries-entries';
import type { SheetDropBind } from './useSheetDrop.type';
import { readEntries } from '../../../sheet-manager/read-entries';

const useSheetDrop = (viewport: RefObject<PixelViewportHandle | null>, sheetId: string | null, readOnly: boolean): SheetDropBind => ({
  onDragOver: (event) => {
    if (!carriesEntries(event.dataTransfer) || sheetId === null) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = readOnly ? 'none' : 'copy';
  },
  onDrop: (event) => {
    if (!carriesEntries(event.dataTransfer) || sheetId === null) return;
    event.preventDefault();
    const entries = readEntries(event.dataTransfer);
    endEntryDrag();
    if (readOnly) {
      useNoticeStore.getState().post(DRAG_WHY.exportShown);
      return;
    }
    const point = viewport.current?.screenToPixel(event.clientX, event.clientY) ?? { x: 0, y: 0 };
    dropOnCanvas(entries, point, sheetId);
  },
});

export { useSheetDrop };
