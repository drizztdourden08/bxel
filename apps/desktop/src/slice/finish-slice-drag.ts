/* @layer renderer-app @kind logic */
import { useSliceToolStore } from '../stores/useSliceToolStore';
import { addSliceRect } from './add-slice-rect';
import type { SliceDrag } from './slice-drag.type';
import { updateSlice } from './update-slice';

const finishSliceDrag = (drag: SliceDrag): void => {
  if (drag.kind === 'new') {
    const added = addSliceRect(drag.rect);
    if (added) useSliceToolStore.getState().select(added);
    return;
  }
  if (drag.kind === 'centre') {
    if (drag.centre.x !== drag.start.x || drag.centre.y !== drag.start.y || drag.centre.width !== drag.start.width || drag.centre.height !== drag.start.height) updateSlice(drag.id, { center: drag.centre });
    return;
  }
  const changed = drag.rect.x !== drag.origin.x || drag.rect.y !== drag.origin.y || drag.rect.width !== drag.origin.width || drag.rect.height !== drag.origin.height;
  if (changed) updateSlice(drag.id, { rect: drag.rect });
};

export { finishSliceDrag };
