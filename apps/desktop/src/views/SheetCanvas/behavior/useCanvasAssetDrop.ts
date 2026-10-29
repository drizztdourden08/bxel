/* @layer renderer-app @kind hook */
import { useDropTarget } from '@drizztdourden08/brock-react';
import type { DndElement } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import { ASSET_DRAG } from '../../../asset-drag/asset-drag.constants';
import type { DragAsset } from '../../../asset-drag/asset-drag.type';
import { assetEntries } from '../../../sheet-manager/asset-entries';
import { DRAG_WHY } from '../../../sheet-manager/drag-payload.constants';
import { dropOnCanvas } from '../../../sheet-manager/drop-on-canvas';
import { useNoticeStore } from '../../../stores/useNoticeStore';
import type { PixelViewportHandle } from '../../PixelViewport';

const useCanvasAssetDrop = (
  ref: RefObject<DndElement | null>,
  viewport: RefObject<PixelViewportHandle | null>,
  sheetId: string | null,
  readOnly: boolean,
): void => {
  useDropTarget<readonly DragAsset[]>(ref, {
    accepts: ASSET_DRAG,
    canDrop: (payload) => sheetId !== null && assetEntries(payload).length > 0,
    onDrop: (payload, info) => {
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
