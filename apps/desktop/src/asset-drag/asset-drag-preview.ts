/* @layer renderer-app @kind logic */
import type { DragPreviewOptions } from '@drizztdourden08/brock-react';
import { labelOf } from './asset-drag-label';
import type { DragAsset } from './asset-drag.type';

const assetDragPreview: DragPreviewOptions<readonly DragAsset[]> = {
  label: labelOf,
  count: (assets) => (assets.length > 1 ? assets.length : undefined),
};

export { assetDragPreview };
