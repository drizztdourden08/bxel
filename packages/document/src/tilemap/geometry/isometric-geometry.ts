/* @layer core @kind logic */
import type { Point } from '../../model/geometry.type';
import { clampToGrid } from './clamp-cell';
import type { GridShape, MapGeometry } from './geometry.type';
import { OUTSIDE_CELL } from './outside-cell.constants';

const diamond = (origin: Point, width: number, height: number): readonly Point[] => [
  { x: origin.x + width / 2, y: origin.y },
  { x: origin.x + width, y: origin.y + height / 2 },
  { x: origin.x + width / 2, y: origin.y + height },
  { x: origin.x, y: origin.y + height / 2 },
];

const isometricGeometry = ({ grid, tile }: GridShape): MapGeometry => {
  const halfWidth = tile.width / 2;
  const halfHeight = tile.height / 2;
  const originOf = (column: number, row: number) => ({
    x: Math.floor((column - row + grid.height - 1) * halfWidth),
    y: Math.floor((column + row) * halfHeight),
  });
  const raw = (x: number, y: number) => {
    const across = (x - grid.height * halfWidth) / halfWidth;
    const down = (y - halfHeight) / halfHeight;
    return { x: Math.floor((across + down) / 2 + 0.5), y: Math.floor((down - across) / 2 + 0.5) };
  };
  return {
    width: Math.floor((grid.width + grid.height) * halfWidth),
    height: Math.floor((grid.width + grid.height) * halfHeight),
    originOf,
    outline: (column, row) => diamond(originOf(column, row), tile.width, tile.height),
    cellAt: (x, y) => {
      const cell = raw(x, y);
      const inside = cell.x >= 0 && cell.y >= 0 && cell.x < grid.width && cell.y < grid.height;
      return inside ? cell : OUTSIDE_CELL;
    },
    cellNear: (x, y) => clampToGrid(raw(x, y), grid),
  };
};

export { isometricGeometry };
