/* @layer renderer-app @kind types */
import type { RefObject } from 'react';
import type { DragMode } from '../../../timeline/drag-mode.type';

interface DragModeState {
  mode: DragMode;
  last: RefObject<DragMode>;
}

export type { DragModeState };
