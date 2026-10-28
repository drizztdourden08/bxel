/* @layer renderer-app @kind logic */
import { ZOOM_FLOOR } from '../PixelViewport.constants';

const zoomLevels = (steps: readonly number[], fit: number): number[] => {
  const whole = [...new Set(steps.filter((step) => step >= 1).map(Math.round))].sort((a, b) => a - b);
  const floor = Math.min(fit, ZOOM_FLOOR);
  const below: number[] = [];
  for (let level = 0.5; level > floor; level /= 2) below.unshift(level);
  if (floor < 1) below.unshift(floor);
  return [...below, ...(whole.length > 0 ? whole : [1])];
};

export { zoomLevels };
