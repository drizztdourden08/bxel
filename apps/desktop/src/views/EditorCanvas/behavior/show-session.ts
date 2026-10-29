/* @layer renderer-app @kind logic */
import type { PaintSession } from '../../../editor/editor.type';
import { useLivePaintStore } from '../../../stores/useLivePaintStore';
import { gestureLive } from './gesture-live';

const showSession = (shown: PaintSession): void => {
  gestureLive.image = new ImageData(shown.rgba, shown.width, shown.height);
  useLivePaintStore.getState().start(shown);
  gestureLive.show(gestureLive.image);
};

export { showSession };
