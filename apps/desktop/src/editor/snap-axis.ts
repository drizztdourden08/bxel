/* @layer renderer-app @kind logic */
import { clampAxis } from './clamp-axis';

const snapAxis = (pixel: number, length: number, linesOnly: boolean): number =>
  clampAxis(linesOnly ? Math.round(pixel) * 2 : Math.round(pixel * 2), length);

export { snapAxis };
