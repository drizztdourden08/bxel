/* @layer renderer-app @kind hook */
import { useDropTarget } from '@drizztdourden08/brock-react';
import type { DndElement } from '@drizztdourden08/brock-react';
import type { DragEvent, RefObject } from 'react';
import { ASSET_DRAG } from '../../../asset-drag/asset-drag.constants';
import type { DragAsset } from '../../../asset-drag/asset-drag.type';
import { openDropped } from '../../../asset-drag/open-dropped';
import { readNativeAssets } from '../../../asset-drag/read-native-assets';
import { ASSET_DRAG_TYPE } from '../../ProjectBrowser/ProjectBrowser.constants';

type TabStripDrop = { readonly onDragOver: (event: DragEvent) => void; readonly onDrop: (event: DragEvent) => void };

const useTabStripDrop = (ref: RefObject<DndElement | null>): TabStripDrop => {
  useDropTarget<readonly DragAsset[]>(ref, {
    accepts: ASSET_DRAG,
    canDrop: (assets) => assets.some((asset) => asset.kind !== 'folder' && asset.path !== ''),
    onDrop: (assets) => void openDropped(assets),
  });
  return {
    onDragOver: (event) => {
      if (!event.dataTransfer.types.includes(ASSET_DRAG_TYPE)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    },
    onDrop: (event) => {
      if (!event.dataTransfer.types.includes(ASSET_DRAG_TYPE)) return;
      event.preventDefault();
      openDropped(readNativeAssets(event.dataTransfer.getData(ASSET_DRAG_TYPE)));
    },
  };
};

export { useTabStripDrop };
