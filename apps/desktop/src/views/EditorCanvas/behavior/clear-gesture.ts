/* @layer renderer-app @kind logic */
import { gesture } from '../../../editor/gesture-state';
import { useGestureStore } from '../../../stores/useGestureStore';
import { useLivePaintStore } from '../../../stores/useLivePaintStore';
import { gestureLive } from './gesture-live';

const clearGesture = (): void => {
  if (gestureLive.timer !== null) window.clearInterval(gestureLive.timer);
  gestureLive.timer = null;
  gestureLive.held = null;
  gestureLive.session = null;
  gestureLive.image = null;
  gesture.dragging = false;
  gesture.space = false;
  useGestureStore.getState().setHint('');
  useLivePaintStore.getState().end();
  gestureLive.show(null);
};

export { clearGesture };
