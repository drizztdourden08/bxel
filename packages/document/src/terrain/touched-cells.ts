/* @layer core @kind logic */
import type { Size } from '../model/geometry.type';
import { NEIGHBOUR_STEPS } from './terrain.constants';

const touchedCells = (indexes: readonly number[], grid: Size): Set<number> => {
  const found = new Set<number>();
  for (const index of indexes) {
    const column = index % grid.width;
    const row = (index - column) / grid.width;
    found.add(index);
    for (const [, dx, dy] of NEIGHBOUR_STEPS) {
      const x = column + dx;
      const y = row + dy;
      if (x >= 0 && y >= 0 && x < grid.width && y < grid.height) found.add(y * grid.width + x);
    }
  }
  return found;
};

export { touchedCells };
