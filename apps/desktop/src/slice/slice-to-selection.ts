/* @layer renderer-app @kind logic */
import { rectMask } from '@bxel/raster';
import { currentTarget } from '../editor/current-target';
import { commitSelection } from '../editor/selection/commit-selection';
import { useNoticeStore } from '../stores/useNoticeStore';
import { selectedSlice } from './selected-slice';
import { SLICE_LABEL } from './slice.constants';

const sliceToSelection = (): boolean => {
  const target = currentTarget();
  const slice = selectedSlice();
  if (!target || !slice) {
    useNoticeStore.getState().post(SLICE_LABEL.needSlice);
    return false;
  }
  const { x, y, width, height } = slice.rect;
  const { width: columns, height: rows } = target.sprite;
  const mask = rectMask({ width: columns, height: rows }, { from: { x: Math.max(0, x), y: Math.max(0, y) }, to: { x: Math.min(columns - 1, x + width - 1), y: Math.min(rows - 1, y + height - 1) } });
  commitSelection(target, mask);
  return true;
};

export { sliceToSelection };
