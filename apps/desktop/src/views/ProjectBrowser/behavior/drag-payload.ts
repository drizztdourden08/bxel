/* @layer renderer-app @kind logic */
import type { DragEvent } from 'react';
import type { BrowserEntry } from '../../../project-browser/project-browser.type';

const ASSET_DRAG_TYPE = 'application/x-bxel-assets';

type DragItem = { readonly id: string; readonly kind: string; readonly assetId: string | null; readonly path: string };

const itemOf = (entry: BrowserEntry): DragItem =>
  entry.kind === 'folder'
    ? { id: entry.id, kind: 'folder', assetId: null, path: entry.path }
    : { id: entry.id, kind: entry.row.kind, assetId: entry.row.assetId, path: entry.row.path };

/** One payload for every drag out of the browser: a list of {kind, assetId, path}, plus the ids the browser itself moves by. */
const writeDrag = (event: DragEvent, entries: readonly BrowserEntry[]): void => {
  event.dataTransfer.setData(ASSET_DRAG_TYPE, JSON.stringify(entries.map(itemOf)));
  event.dataTransfer.effectAllowed = 'move';
};

const hasAssetDrag = (event: DragEvent): boolean => event.dataTransfer.types.includes(ASSET_DRAG_TYPE);

const readDragIds = (event: DragEvent): readonly string[] => {
  try {
    const parsed: unknown = JSON.parse(event.dataTransfer.getData(ASSET_DRAG_TYPE));
    return Array.isArray(parsed) ? parsed.flatMap((each: unknown) => (typeof each === 'object' && each !== null && 'id' in each && typeof each.id === 'string' ? [each.id] : [])) : [];
  } catch {
    return [];
  }
};

export { hasAssetDrag, readDragIds, writeDrag };
