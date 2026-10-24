/* @layer core @kind logic */
import type { Size } from '../model/geometry.type';
import { NEIGHBOUR_STEPS } from './terrain.constants';

const neighbourMask = (cells: Uint32Array, grid: Size, index: number, isMember: (cell: number) => boolean): number => {
  const column = index % grid.width;
  const row = (index - column) / grid.width;
  let mask = 0;
  for (const [bit, dx, dy] of NEIGHBOUR_STEPS) {
    const x = column + dx;
    const y = row + dy;
    const inside = x >= 0 && y >= 0 && x < grid.width && y < grid.height;
    if (inside && isMember(cells[y * grid.width + x] ?? 0)) mask |= bit;
  }
  return mask;
};

export { neighbourMask };
