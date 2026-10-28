/* @layer renderer-app @kind logic */
import { ASSET_DRAG_TYPE } from './asset-drag.constants';
import type { DragAsset } from './asset-drag.type';

const readAssetDrag = (transfer: DataTransfer): readonly DragAsset[] => {
  try {
    const parsed: unknown = JSON.parse(transfer.getData(ASSET_DRAG_TYPE));
    return Array.isArray(parsed) ? (parsed as DragAsset[]) : [];
  } catch {
    return [];
  }
};

export { readAssetDrag };
