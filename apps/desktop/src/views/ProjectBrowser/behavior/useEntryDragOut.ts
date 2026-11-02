/* @layer renderer-app @kind hook */
import { useDragSource } from '@drizztdourden08/brock-react';
import type { DndElement } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import { assetDragPreview } from '../../../asset-drag/asset-drag-preview';
import { ASSET_DRAG } from '../../../asset-drag/asset-drag.constants';
import type { DragAsset } from '../../../asset-drag/asset-drag.type';
import { browserAsset } from './browser-asset';
import type { EntryDragOut } from './useEntryDragOut.type';

const useEntryDragOut = (ref: RefObject<DndElement | null>, { picked, disabled }: EntryDragOut): void =>
  useDragSource<readonly DragAsset[]>(ref, {
    type: ASSET_DRAG,
    preview: assetDragPreview,
    disabled,
    payload: () => picked.map(browserAsset),
  });

export { useEntryDragOut };
