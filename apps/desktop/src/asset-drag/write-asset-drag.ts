/* @layer renderer-app @kind logic */
import { SPRITE_DRAG_TYPE } from '../sheet/sprite-drag.constants';
import { ASSET_DRAG_TYPE } from './asset-drag.constants';
import type { DragAsset } from './asset-drag.type';

const writeAssetDrag = (transfer: DataTransfer, assets: readonly DragAsset[]): void => {
  transfer.setData(ASSET_DRAG_TYPE, JSON.stringify(assets));
  const sprite = assets.find((asset) => asset.kind === 'sprite' && asset.assetId !== null);
  if (sprite?.assetId) transfer.setData(SPRITE_DRAG_TYPE, sprite.assetId);
  transfer.effectAllowed = 'copyMove';
};

export { writeAssetDrag };
