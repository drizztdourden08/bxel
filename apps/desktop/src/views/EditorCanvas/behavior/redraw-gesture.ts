/* @layer renderer-app @kind logic */
import { gestureLive } from './gesture-live';

const redrawGesture = (): void => gestureLive.redraw();

export { redrawGesture };
