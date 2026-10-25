/* @layer renderer-app @kind logic */
import { dirtyPixels } from './dirty-pixels';

const trackPixels = (rgba: Uint8ClampedArray): void => {
  dirtyPixels.set(rgba, null);
};

export { trackPixels };
