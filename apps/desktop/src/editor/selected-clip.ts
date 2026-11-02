/* @layer renderer-app @kind logic */
import { useNoticeStore } from '../stores/useNoticeStore';
import { currentTarget } from './current-target';
import { celPixels } from './selection/cel-pixels';
import { clipOf } from './selection/clip-of';
import { SELECTION_TEXT } from './selection/selection.constants';
import { selectionMask } from './selection/selection-mask';

const selectedClip = () => {
  const target = currentTarget();
  const mask = target ? selectionMask(target) : null;
  const clip = target && mask ? clipOf(celPixels(target), mask) : null;
  if (!target || !clip) {
    useNoticeStore.getState().post(SELECTION_TEXT.nothingSelected);
    return null;
  }
  return { target, clip };
};

export { selectedClip };
