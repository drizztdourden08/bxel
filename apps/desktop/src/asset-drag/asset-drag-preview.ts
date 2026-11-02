/* @layer renderer-app @kind logic */
import type { DragPreviewOptions } from '@drizztdourden08/brock-react';
import { MANAGER_TEXT } from '../sheet-manager/manager-text.constants';
import type { DragAsset } from './asset-drag.type';

const nameOf = (path: string): string => path.split('/').pop() ?? path;

const labelOf = (assets: readonly DragAsset[]): string => (assets.length === 1 ? nameOf(assets[0]?.path ?? '') : MANAGER_TEXT.dragCount(assets.length));

const assetDragPreview: DragPreviewOptions<readonly DragAsset[]> = {
  label: labelOf,
  count: (assets) => assets.length,
};

export { assetDragPreview, labelOf };
