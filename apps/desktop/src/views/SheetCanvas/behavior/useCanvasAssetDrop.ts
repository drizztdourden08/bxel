/* @layer renderer-app @kind hook */
import { dnd, useDropTarget } from '@drizztdourden08/brock-react';
import type { DndElement } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import { ASSET_DRAG } from '../../../asset-drag/asset-drag.constants';
import { dropFiles } from '../../../image-import/drop-files';
import { isImageFile } from '../../../image-import/is-image-file';
import { assetEntries } from '../../../sheet-manager/asset-entries';
import { DRAG_WHY } from '../../../sheet-manager/drag-payload.constants';
import { dropOnCanvas } from '../../../sheet-manager/drop-on-canvas';
import { useNoticeStore } from '../../../stores/useNoticeStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { SheetAssetPayload } from './useCanvasAssetDrop.type';

const useCanvasAssetDrop = (
  ref: RefObject<DndElement | null>,
  viewport: RefObject<PixelViewportHandle | null>,
  sheetId: string | null,
  readOnly: boolean,
): void => {
  useDropTarget<SheetAssetPayload>(ref, {
    accepts: [dnd.files, ASSET_DRAG],
    canDrop: (payload) => ('files' in payload ? payload.files.some((each) => isImageFile(each.file)) : sheetId !== null && assetEntries(payload).length > 0),
    onDrop: (payload, info) => {
      if (dropFiles(payload)) return;
      if (sheetId === null) return;
      if (readOnly) {
        useNoticeStore.getState().post(DRAG_WHY.exportShown);
        return;
      }
      const point = viewport.current?.screenToPixel(info.point.x, info.point.y) ?? { x: 0, y: 0 };
      dropOnCanvas(assetEntries(payload), point, sheetId);
    },
  });
};

export { useCanvasAssetDrop };
