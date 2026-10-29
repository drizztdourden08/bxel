/* @layer renderer-app @kind hook */
import { dnd, useDropTarget } from '@drizztdourden08/brock-react';
import type { DndElement } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import { ASSET_DRAG } from '../../../asset-drag/asset-drag.constants';
import { dropImage } from '../../../image-import/drop-image';
import { isImageFile } from '../../../image-import/is-image-file';
import { assetEntries } from '../../../sheet-manager/asset-entries';
import { dropEntries } from '../../../sheet-manager/drop-entries';
import { dropTargetAt } from '../../../sheet-manager/drop-target-at';
import type { ManagerModel } from '../SpritesPanel.type';
import type { AssetDropPayload } from './useAssetDrop.type';

const useAssetDrop = (ref: RefObject<DndElement | null>, model: ManagerModel | null): void => {
  const sheetId = model?.sheet?.id ?? null;
  useDropTarget<AssetDropPayload>(ref, {
    accepts: [dnd.files, ASSET_DRAG],
    canDrop: (payload) => 'files' in payload || (sheetId !== null && assetEntries(payload).length > 0),
    onDrop: (payload, info) => {
      if ('files' in payload) {
        const file = payload.files.map((each) => each.file).find(isImageFile);
        if (file) void dropImage(file);
        return;
      }
      dropEntries(assetEntries(payload), dropTargetAt(info.point), sheetId);
    },
  });
};

export { useAssetDrop };
