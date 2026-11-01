/* @layer core @kind logic */
import type { Grid } from './grid.type';

const transposeGrid = (grid: Grid): Grid => {
  const pixels = new Uint8Array(grid.pixels.length);
  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) pixels[x * grid.height + y] = grid.pixels[y * grid.width + x] ?? 0;
  }
  return { pixels, width: grid.height, height: grid.width };
};

export { transposeGrid };
