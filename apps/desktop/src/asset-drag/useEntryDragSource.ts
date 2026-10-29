/* @layer renderer-app @kind hook */
import { useDragSource } from '@drizztdourden08/brock-react';
import type { DndElement } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import type { EntryDragSpec } from '../sheet-manager/drag-payload.type';
import { useEntryDragStore } from '../stores/useEntryDragStore';
import { ASSET_DRAG } from './asset-drag.constants';
import type { DragAsset } from './asset-drag.type';
import { entryAsset } from './entry-asset';

const useEntryDragSource = (ref: RefObject<DndElement | null>, spec: EntryDragSpec): void =>
  useDragSource<readonly DragAsset[]>(ref, {
    type: ASSET_DRAG,
    disabled: spec.disabled === true,
    payload: () => spec.entries().map((entry) => entryAsset(entry, spec.source)),
    onStart: () => useEntryDragStore.getState().begin({ source: spec.source, entries: spec.entries() }),
    onEnd: () => useEntryDragStore.getState().finish(),
  });

export { useEntryDragSource };
