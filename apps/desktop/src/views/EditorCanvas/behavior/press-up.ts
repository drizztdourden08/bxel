/* @layer renderer-app @kind logic */
import { endGesture } from '../../../editor/end-gesture';
import { handOffImage } from '../../../editor/hand-off-image';
import { clearGesture } from './clear-gesture';
import { gestureLive } from './gesture-live';
import { releasePath } from './release-path';

const pressUp = (): void => {
  const done = gestureLive.session;
  if (!done) return;
  if (done.kind === 'path') {
    releasePath(done);
    return;
  }
  const shown = gestureLive.image;
  clearGesture();
  const result = endGesture(done);
  if (shown && result) handOffImage(done, shown, result);
};

export { pressUp };
