/* @layer renderer-app @kind logic */
import { CLOCK } from './playback-clock.constants';

const resetClock = (): void => {
  CLOCK.elapsed = 0;
  CLOCK.last = null;
  CLOCK.shown = null;
};

export { resetClock };
