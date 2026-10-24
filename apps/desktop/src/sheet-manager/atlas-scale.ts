/* @layer renderer-app @kind logic */
import { ATLAS_CANVAS_SIDE } from './manager.constants';

const atlasScale = (zoom: number, width: number, height: number): number => {
  const longest = Math.max(1, width, height);
  return Math.max(1, Math.min(zoom, Math.floor(ATLAS_CANVAS_SIDE / longest)));
};

export { atlasScale };
