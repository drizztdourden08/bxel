/* @layer renderer-app @kind logic */
import type { MaskView } from '@bxel/raster';
import { edgeRuns } from './edge-runs';

const inside = (mask: MaskView, x: number, y: number): boolean =>
  x >= 0 && y >= 0 && x < mask.width && y < mask.height && (mask.bits[y * mask.width + x] ?? 0) !== 0;

const maskOutline = (mask: MaskView): number[] => {
  const lines: number[] = [];
  for (let row = 0; row <= mask.height; row += 1) {
    edgeRuns(mask.width, (x) => inside(mask, x, row - 1) !== inside(mask, x, row), (from, to) => lines.push(from, row, to, row));
  }
  for (let column = 0; column <= mask.width; column += 1) {
    edgeRuns(mask.height, (y) => inside(mask, column - 1, y) !== inside(mask, column, y), (from, to) => lines.push(column, from, column, to));
  }
  return lines;
};

export { maskOutline };
