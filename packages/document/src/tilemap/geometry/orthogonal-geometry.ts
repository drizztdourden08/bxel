/* @layer core @kind logic */
import type { MapGeometry, GridShape } from './geometry.type';
import { clampToGrid } from './clamp-cell';
import { rectOutline } from './rect-outline';

const orthogonalGeometry = ({ grid, tile }: GridShape): MapGeometry => {
  const originOf = (column: number, row: number) => ({ x: column * tile.width, y: row * tile.height });
  const cellAt = (x: number, y: number) => ({ x: Math.floor(x / tile.width), y: Math.floor(y / tile.height) });
  return {
    width: grid.width * tile.width,
    height: grid.height * tile.height,
    originOf,
    outline: (column, row) => rectOutline(originOf(column, row), tile),
    cellAt,
    cellNear: (x, y) => clampToGrid(cellAt(x, y), grid),
  };
};

export { orthogonalGeometry };
