/* @layer renderer-app @kind hook */
import type { DragEvent, RefObject } from 'react';
import { DRAG_WHY } from '../../../sheet-manager/drag-payload.constants';
import { carriesEntries, endEntryDrag, readEntries } from '../../../sheet-manager/drag-payload';
import { dropOnCanvas } from '../../../sheet-manager/drop-on-canvas';
import { useNoticeStore } from '../../../stores/useNoticeStore';
import type { PixelViewportHandle } from '../../PixelViewport';

interface SheetDropBind {
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDrop: (event: DragEvent<HTMLElement>) => void;
}

/** Entries dragged from the Library or the Project panel land on the sheet where they are dropped. */
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
