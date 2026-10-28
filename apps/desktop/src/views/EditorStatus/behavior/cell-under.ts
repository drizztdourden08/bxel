/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { MapContext } from '../../../tilemap/tilemap.type';
import { mapTarget } from '../../../tilemap/map-target';
import { readCell } from '../../../tilemap/read-cell';
import { cellOf } from '../../TilemapCanvas/behavior/cell-of';

interface CellUnder {
  at: Point;
  key: number | null;
}

const cellUnder = (map: MapContext | null, pointer: Point | null): CellUnder | null => {
  const full = mapTarget(map);
  if (!full || !pointer) return null;
  const at = cellOf(pointer, full);
  const key = readCell(full.tilemap, full.layer, at)?.key ?? 0;
  return { at, key: key === 0 ? null : key };
};

export { cellUnder };
