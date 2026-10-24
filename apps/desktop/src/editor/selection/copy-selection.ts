/* @layer renderer-app @kind logic */
import { useNoticeStore } from '../../stores/useNoticeStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { currentTarget } from '../current-target';
import { celPixels } from './cel-pixels';
import { clipOf } from './clip-of';
import { SELECTION_TEXT } from './selection.constants';
import { selectionMask } from './selection-mask';

const copySelection = (): boolean => {
  const target = currentTarget();
  const mask = target ? selectionMask(target) : null;
  const clip = target && mask ? clipOf(celPixels(target), mask) : null;
  if (!clip) {
    useNoticeStore.getState().post(SELECTION_TEXT.nothingSelected);
    return false;
  }
  useSelectionStore.getState().setClipboard(clip);
  return true;
};

export { copySelection };
