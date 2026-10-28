/* @layer renderer-app @kind logic */
import { useNoticeStore } from '../../stores/useNoticeStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { currentTarget } from '../current-target';
import { celPixels } from './cel-pixels';
import { clipOf } from './clip-of';
import { mergedPixels } from './merged-pixels';
import { SELECTION_TEXT } from './selection.constants';
import { selectionMask } from './selection-mask';
import { writeSystemClip } from './write-system-clip';

const copyFrom = (merged: boolean): boolean => {
  const target = currentTarget();
  const mask = target ? selectionMask(target) : null;
  const clip = target && mask ? clipOf(merged ? mergedPixels(target) : celPixels(target), mask) : null;
  if (!clip || !target) {
    useNoticeStore.getState().post(SELECTION_TEXT.nothingSelected);
    return false;
  }
  useSelectionStore.getState().setClipboard(clip);
  void writeSystemClip(clip, target);
  return true;
};

export { copyFrom };
