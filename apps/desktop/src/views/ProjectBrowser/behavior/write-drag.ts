/* @layer renderer-app @kind logic */
import type { DragEvent } from 'react';
import type { BrowserEntry } from '../../../project-browser/project-browser.type';
import { ASSET_DRAG_TYPE } from '../ProjectBrowser.constants';
import type { DragItem } from '../ProjectBrowser.type';

const itemOf = (entry: BrowserEntry): DragItem =>
  entry.kind === 'folder'
    ? { id: entry.id, kind: 'folder', assetId: null, path: entry.path }
    : { id: entry.id, kind: entry.row.kind, assetId: entry.row.assetId, path: entry.row.path };

const writeDrag = (event: DragEvent, entries: readonly BrowserEntry[]): void => {
  event.dataTransfer.setData(ASSET_DRAG_TYPE, JSON.stringify(entries.map(itemOf)));
  event.dataTransfer.effectAllowed = 'move';
};

export { writeDrag };
