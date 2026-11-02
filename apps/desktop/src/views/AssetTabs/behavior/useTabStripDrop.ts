/* @layer renderer-app @kind hook */
import { useDropTarget } from '@drizztdourden08/brock-react';
import type { DndElement } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import { ASSET_DRAG } from '../../../asset-drag/asset-drag.constants';
import type { DragAsset } from '../../../asset-drag/asset-drag.type';
import { openDropped } from '../../../asset-drag/open-dropped';

const useTabStripDrop = (ref: RefObject<DndElement | null>): void => {
  useDropTarget<readonly DragAsset[]>(ref, {
    accepts: ASSET_DRAG,
    canDrop: (assets) => assets.some((asset) => asset.kind !== 'folder' && asset.path !== ''),
    onDrop: (assets) => void openDropped(assets),
  });
};

export { useTabStripDrop };
