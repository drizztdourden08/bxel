/* @layer renderer-app @kind logic */
import type { DragEntry, DragSource } from '../sheet-manager/drag-payload.type';
import type { DragAsset } from './asset-drag.type';

const entryAsset = (entry: DragEntry, origin: DragSource): DragAsset => ({
  id: entry.tagId === undefined || entry.tagId === null ? entry.assetId : `${entry.assetId}:${entry.tagId}`,
  kind: entry.kind,
  assetId: entry.assetId,
  path: entry.path,
  tagId: entry.tagId ?? null,
  origin,
});

export { entryAsset };
