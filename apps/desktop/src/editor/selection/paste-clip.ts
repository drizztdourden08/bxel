/* @layer renderer-app @kind logic */
import { useNoticeStore } from '../../stores/useNoticeStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { currentTarget } from '../current-target';
import { beginPending } from '../pending/begin-pending';
import { fitOffset } from '../pending/fit-offset';
import { SELECTION_TEXT } from './selection.constants';

const pasteClip = (): boolean => {
  const clip = useSelectionStore.getState().clipboard;
  const target = currentTarget();
  const notices = useNoticeStore.getState();
  if (!clip || !target) {
    notices.post(SELECTION_TEXT.nothingToPaste);
    return false;
  }
  if (clip.width > target.sprite.width || clip.height > target.sprite.height) {
    notices.post(SELECTION_TEXT.tooLarge);
    return false;
  }
  return beginPending({ kind: 'paste', clip, offset: fitOffset(clip, { x: 0, y: 0 }, target.sprite) });
};

export { pasteClip };
