/* @layer renderer-app @kind hook */
import { useDragSource } from '@drizztdourden08/brock-react';
import type { DndElement } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import type { EntryDragSpec } from '../sheet-manager/drag-payload.type';
import type { DragAsset } from './asset-drag.type';
import { entryDragOptions } from './entry-drag-options';

const useEntryDragSource = (ref: RefObject<DndElement | null>, spec: EntryDragSpec): void =>
  useDragSource<readonly DragAsset[]>(ref, entryDragOptions(spec));

export { useEntryDragSource };
