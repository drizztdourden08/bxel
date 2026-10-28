/* @layer renderer-app @kind logic */
import { TRANSPARENT_INDEX } from '@bxel/document';

import type { Grid } from './edge-mask.type';

const solid = (grid: Grid, x: number, y: number): boolean =>
  x >= 0 && y >= 0 && x < grid.width && y < grid.height && grid.indices[y * grid.width + x] !== TRANSPARENT_INDEX;

const edgeMask = (indices: ArrayLike<number>, width: number, height: number): Uint8Array => {
  const mask = new Uint8Array(width * height);
  const grid: Grid = { indices, width, height };
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!solid(grid, x, y)) continue;
      const inside = solid(grid, x - 1, y) && solid(grid, x + 1, y) && solid(grid, x, y - 1) && solid(grid, x, y + 1);
      mask[y * width + x] = inside ? 0 : 1;
    }
  }
  return mask;
};

export { edgeMask };
