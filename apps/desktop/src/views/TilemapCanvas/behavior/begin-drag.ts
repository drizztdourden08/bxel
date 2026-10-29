/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import type { CombineMode } from '@bxel/raster';
import { fillAt } from '../../../tilemap/fill-at';
import type { MapTarget, MapTool } from '../../../tilemap/tilemap.type';
import type { MapDrag } from '../TilemapCanvas.type';
import { clampCell } from './clamp-cell';

const beginDrag = (tool: MapTool, cell: Point, target: MapTarget, mode: CombineMode = 'replace'): MapDrag | null => {
  if (tool === 'place' || tool === 'erase' || tool === 'scatter') return { kind: 'stroke', tool, cells: [cell] };
  if (tool === 'line') {
    const edge = clampCell(cell, target.tilemap);
    return { kind: 'line', from: edge, to: edge };
  }
  if (tool === 'rect') {
    const edge = clampCell(cell, target.tilemap);
    return { kind: 'rect', from: edge, to: edge };
  }
  if (tool === 'select') {
    const edge = clampCell(cell, target.tilemap);
    return { kind: 'select', from: edge, to: edge, mode };
  }
  if (tool === 'fill') fillAt(cell);
  if (tool !== 'pick') return null;
  const edge = clampCell(cell, target.tilemap);
  return { kind: 'pick', from: edge, to: edge };
};

export { beginDrag };
