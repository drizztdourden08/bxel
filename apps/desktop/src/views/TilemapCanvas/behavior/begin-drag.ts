/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import { fillAt } from '../../../tilemap/fill-at';
import { pickAt } from '../../../tilemap/pick-at';
import type { MapTarget, MapTool } from '../../../tilemap/tilemap.type';
import type { MapDrag } from '../TilemapCanvas.type';
import { clampCell } from './clamp-cell';

const beginDrag = (tool: MapTool, cell: Point, target: MapTarget): MapDrag | null => {
  if (tool === 'place' || tool === 'erase') return { kind: 'stroke', tool, cells: [cell] };
  if (tool === 'rect' || tool === 'select') {
    const edge = clampCell(cell, target.tilemap);
    return { kind: tool, from: edge, to: edge };
  }
  if (tool === 'fill') fillAt(cell);
  if (tool === 'pick') pickAt(cell);
  return null;
};

export { beginDrag };
