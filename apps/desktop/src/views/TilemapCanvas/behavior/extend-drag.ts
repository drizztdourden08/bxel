/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import type { TileStamp } from '../../../stores/tilemap-store.type';
import type { MapTarget } from '../../../tilemap/tilemap.type';
import type { MapDrag } from '../TilemapCanvas.type';
import { clampCell } from './clamp-cell';
import { nextCells } from './next-cells';

const extendDrag = (drag: MapDrag, cell: Point, stamp: TileStamp, target: MapTarget): MapDrag => {
  if (drag.kind !== 'stroke') return { ...drag, to: clampCell(cell, target.tilemap) };
  const step = drag.tool === 'place' ? { width: stamp.columns, height: stamp.rows } : { width: 1, height: 1 };
  return { ...drag, cells: nextCells(drag.cells, cell, step) };
};

export { extendDrag };
