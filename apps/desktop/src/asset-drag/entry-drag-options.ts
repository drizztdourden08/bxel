/* @layer renderer-app @kind logic */
import type { DragSourceOptions } from '@drizztdourden08/brock-react';
import type { EntryDragSpec } from '../sheet-manager/drag-payload.type';
import { useEntryDragStore } from '../stores/useEntryDragStore';
import { assetDragPreview } from './asset-drag-preview';
import { ASSET_DRAG } from './asset-drag.constants';
import type { DragAsset } from './asset-drag.type';
import { entryAsset } from './entry-asset';

const entryDragOptions = (spec: EntryDragSpec): DragSourceOptions<readonly DragAsset[]> => ({
  type: ASSET_DRAG,
  disabled: spec.disabled === true,
  preview: assetDragPreview,
  payload: () => spec.entries().map((entry) => entryAsset(entry, spec.source)),
  onStart: () => useEntryDragStore.getState().begin({ source: spec.source, entries: spec.entries() }),
  onEnd: () => useEntryDragStore.getState().finish(),
});

export { entryDragOptions };
