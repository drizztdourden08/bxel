/* @layer renderer-app @kind logic */
import type { DragAsset } from '../asset-drag/asset-drag.type';
import type { DragEntry } from './drag-payload.type';

const assetEntries = (assets: readonly DragAsset[]): DragEntry[] =>
  assets.flatMap((asset): DragEntry[] => {
    if ((asset.kind !== 'sprite' && asset.kind !== 'animation') || asset.assetId === null) return [];
    return [{ kind: asset.kind, assetId: asset.assetId, path: asset.path, tagId: null }];
  });

export { assetEntries };
