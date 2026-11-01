/* @layer renderer-app @kind logic */
import { useSliceToolStore } from '../stores/useSliceToolStore';
import { addSliceRect } from './add-slice-rect';
import { sameRect } from './same-rect';
import type { SliceDrag } from './slice-drag.type';
import { updateSlice } from './update-slice';

const finishSliceDrag = (drag: SliceDrag): void => {
  if (drag.kind === 'new') {
    const added = addSliceRect(drag.rect);
    if (added) useSliceToolStore.getState().select(added);
    return;
  }
  if (drag.kind === 'centre') {
    if (!sameRect(drag.centre, drag.start)) updateSlice(drag.id, { center: drag.centre });
    return;
  }
  if (!sameRect(drag.rect, drag.origin)) updateSlice(drag.id, { rect: drag.rect });
};

export { finishSliceDrag };
