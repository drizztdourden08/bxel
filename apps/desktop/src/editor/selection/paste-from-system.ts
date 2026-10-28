/* @layer renderer-app @kind logic */
import { useNoticeStore } from '../../stores/useNoticeStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { currentTarget } from '../current-target';
import { pasteClip } from './paste-clip';
import { pasteInPlace } from './paste-in-place';
import { SELECTION_TEXT } from './selection.constants';
import { readSystemClip } from './read-system-clip';

const pasteFromSystem = async (inPlace: boolean): Promise<boolean> => {
  const target = currentTarget();
  const found = target ? await readSystemClip(target) : null;
  if (found) {
    useSelectionStore.getState().setClipboard(found.clip);
    if (found.changed) useNoticeStore.getState().post(SELECTION_TEXT.pastedRemapped);
  }
  return inPlace ? pasteInPlace() : pasteClip();
};

export { pasteFromSystem };
