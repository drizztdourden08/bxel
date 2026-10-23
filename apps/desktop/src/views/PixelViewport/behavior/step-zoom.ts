/* @layer renderer-app @kind logic */
import { ZOOM_EPSILON } from '../PixelViewport.constants';

const stepZoom = (levels: readonly number[], zoom: number, direction: number): number => {
  if (direction > 0) return levels.find((level) => level > zoom + ZOOM_EPSILON) ?? levels.at(-1) ?? zoom;
  return [...levels].reverse().find((level) => level < zoom - ZOOM_EPSILON) ?? levels[0] ?? zoom;
};

export { stepZoom };
