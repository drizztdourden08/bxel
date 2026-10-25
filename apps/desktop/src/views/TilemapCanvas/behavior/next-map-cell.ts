/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import type { MapKeyContext } from '../TilemapCanvas.type';
import { clampCell } from './clamp-cell';

const next = (cell: Point, delta: Point, context: MapKeyContext): Point =>
  clampCell({ x: cell.x + delta.x, y: cell.y + delta.y }, context.target.tilemap);

const nextMapCell = (delta: Point, context: MapKeyContext): Point => {
  const { tilemap } = context.target;
  const hover = context.live.current.hover;
  if (!context.active.current || !hover) return { x: Math.floor(tilemap.columns / 2), y: Math.floor(tilemap.rows / 2) };
  return next(hover, delta, context);
};

export { nextMapCell };
