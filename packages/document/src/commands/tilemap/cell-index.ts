/* @layer core @kind logic */
import type { Point } from '../../model/geometry.type';
import type { Tilemap } from '../../model/tilemap.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const cellIndex = (tilemap: Tilemap, point: Point, path: string): number => {
  const inside = point.x >= 0 && point.y >= 0 && point.x < tilemap.columns && point.y < tilemap.rows;
  if (!inside) {
    throw fail(ERROR_CODE.OUT_OF_BOUNDS, `Cell (${point.x}, ${point.y}) is outside the ${tilemap.columns} x ${tilemap.rows} map.`, {
      path,
    });
  }
  return point.y * tilemap.columns + point.x;
};

export { cellIndex };
