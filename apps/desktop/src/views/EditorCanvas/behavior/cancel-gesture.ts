/* @layer renderer-app @kind logic */
import { pathDraft } from '../../../editor/path-draft';
import { clearGesture } from './clear-gesture';
import { gestureLive } from './gesture-live';

const cancelGesture = (): void => {
  pathDraft.current = null;
  clearGesture();
  gestureLive.redraw();
};

export { cancelGesture };
