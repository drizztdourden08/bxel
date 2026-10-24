/* @layer core @kind logic */
import type { Point } from '../../model/geometry.type';
import type { MapOrientation } from '../../model/tilemap.type';
import { clampToGrid } from './clamp-cell';
import type { GridShape, MapGeometry } from './geometry.type';
import { insidePolygon } from './inside-polygon';
import { OUTSIDE_CELL } from './outside-cell.constants';
import { staggerOutline } from './stagger-outline';
import { staggerSteps } from './stagger-steps';
import { STAGGER_REACH } from './stagger.constants';

const staggerGeometry = ({ grid, tile }: GridShape, orientation: MapOrientation): MapGeometry => {
  const steps = staggerSteps(tile, orientation);
  const alongY = orientation.staggerAxis === 'y';
  const shifted = (line: number): boolean => (line % 2 === 1) === (orientation.staggerIndex === 'odd');
  const originOf = (column: number, row: number): Point =>
    alongY
      ? { x: Math.floor(column * steps.column + (shifted(row) ? tile.width / 2 : 0)), y: Math.floor(row * steps.row) }
      : { x: Math.floor(column * steps.column), y: Math.floor(row * steps.row + (shifted(column) ? tile.height / 2 : 0)) };
  const outline = (column: number, row: number) => staggerOutline(originOf(column, row), tile, orientation);
  const edges = (size: number): number[] => [...new Set([0, 1, size - 2, size - 1].filter((at) => at >= 0 && at < size))];
  const origins = edges(grid.width).flatMap((column) => edges(grid.height).map((row) => originOf(column, row)));
  const guess = (x: number, y: number): Point => ({ x: Math.floor(x / steps.column), y: Math.floor(y / steps.row) });
  const candidates = (x: number, y: number): Point[] => {
    const centre = guess(x, y);
    const found: Point[] = [];
    for (let dy = -STAGGER_REACH; dy <= STAGGER_REACH; dy += 1) {
      for (let dx = -STAGGER_REACH; dx <= STAGGER_REACH; dx += 1) found.push({ x: centre.x + dx, y: centre.y + dy });
    }
    return found.filter((cell) => cell.x >= 0 && cell.y >= 0 && cell.x < grid.width && cell.y < grid.height);
  };
  return {
    width: Math.max(...origins.map((origin) => origin.x)) + tile.width,
    height: Math.max(...origins.map((origin) => origin.y)) + tile.height,
    originOf,
    outline,
    cellAt: (x, y) => candidates(x, y).find((cell) => insidePolygon(outline(cell.x, cell.y), x, y)) ?? OUTSIDE_CELL,
    cellNear: (x, y) => {
      const spots = candidates(x, y);
      const best = spots.reduce<{ cell: Point; gap: number } | null>((found, cell) => {
        const origin = originOf(cell.x, cell.y);
        const gap = (origin.x + tile.width / 2 - x) ** 2 + (origin.y + tile.height / 2 - y) ** 2;
        return found && found.gap <= gap ? found : { cell, gap };
      }, null);
      return best?.cell ?? clampToGrid(guess(x, y), grid);
    },
  };
};

export { staggerGeometry };
