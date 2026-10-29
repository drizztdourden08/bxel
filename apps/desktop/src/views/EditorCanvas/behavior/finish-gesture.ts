/* @layer renderer-app @kind logic */
import { commitDraft } from '../../../editor/commit-draft';
import { handOffImage } from '../../../editor/hand-off-image';
import { clearGesture } from './clear-gesture';
import { gestureLive } from './gesture-live';

const finishGesture = (): void => {
  const shown = gestureLive.image;
  const done = commitDraft();
  clearGesture();
  if (done && shown) handOffImage(done.session, shown, done.result);
  gestureLive.redraw();
};

export { finishGesture };
