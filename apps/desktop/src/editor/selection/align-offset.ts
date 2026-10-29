/* @layer renderer-app @kind logic */
import type { Point, Rect, Size } from '@bxel/raster';
import type { AlignEdge } from './align-edge.type';

const along = (edge: AlignEdge, box: { start: number; length: number }, whole: number): number => {
  if (edge === 'left' || edge === 'top') return -box.start;
  if (edge === 'right' || edge === 'bottom') return whole - box.length - box.start;
  return Math.floor((whole - box.length) / 2) - box.start;
};

const alignOffset = (edge: AlignEdge, box: Rect, size: Size): Point => {
  const horizontal = edge === 'left' || edge === 'centre' || edge === 'right';
  return horizontal ? { x: along(edge, { start: box.x, length: box.width }, size.width), y: 0 } : { x: 0, y: along(edge, { start: box.y, length: box.height }, size.height) };
};

export { alignOffset };
