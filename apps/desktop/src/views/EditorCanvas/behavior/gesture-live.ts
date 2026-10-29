/* @layer renderer-app @kind logic */
import type { GestureLive } from './gesture-live.type';

const gestureLive: GestureLive = {
  session: null,
  image: null,
  timer: null,
  held: null,
  show: () => undefined,
  redraw: () => undefined,
};

export { gestureLive };
