/* @layer renderer-app @kind logic */
import { ZOOM } from './manager.constants';

const wheelBox = (current: number, deltaY: number): number => {
  const next = current + (deltaY < 0 ? ZOOM.step : -ZOOM.step);
  return Math.min(ZOOM.max, Math.max(ZOOM.min, next));
};

export { wheelBox };
