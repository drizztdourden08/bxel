/* @layer renderer-app @kind logic */
import type { ReorderDropInfo } from '@drizztdourden08/tessera';
import type { DragMode } from './drag-mode.type';

const dragModeOf = (modifier: ReorderDropInfo['modifier']): DragMode => {
  if (modifier === 'ctrl') return 'copy';
  return modifier === 'alt' ? 'link' : 'move';
};

export { dragModeOf };
