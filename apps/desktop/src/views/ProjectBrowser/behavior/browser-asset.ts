/* @layer renderer-app @kind logic */
import type { DragAsset } from '../../../asset-drag/asset-drag.type';
import type { BrowserEntry } from '../../../project-browser/project-browser.type';

const browserAsset = (entry: BrowserEntry): DragAsset =>
  entry.kind === 'folder'
    ? { id: entry.id, kind: 'folder', assetId: null, path: entry.path }
    : { id: entry.id, kind: entry.row.kind, assetId: entry.row.assetId, path: entry.row.path };

export { browserAsset };
