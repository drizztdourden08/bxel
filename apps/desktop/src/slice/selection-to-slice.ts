/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import { selectionBounds } from '../editor/selection/selection-bounds';
import { useNoticeStore } from '../stores/useNoticeStore';
import { useSliceToolStore } from '../stores/useSliceToolStore';
import { addSliceRect } from './add-slice-rect';
import { SLICE_LABEL } from './slice.constants';

const selectionToSlice = (): boolean => {
  const target = currentTarget();
  const box = target ? selectionBounds(target) : null;
  const id = box ? addSliceRect({ x: box.x, y: box.y, width: box.width, height: box.height }) : null;
  if (id === null) {
    useNoticeStore.getState().post(SLICE_LABEL.needSelection);
    return false;
  }
  useSliceToolStore.getState().select(id);
  return true;
};

export { selectionToSlice };
