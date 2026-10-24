/* @layer core @kind logic */
import type { Point, Size } from '../../model/geometry.type';

const rectOutline = (origin: Point, tile: Size): readonly Point[] => [
  { x: origin.x, y: origin.y },
  { x: origin.x + tile.width, y: origin.y },
  { x: origin.x + tile.width, y: origin.y + tile.height },
  { x: origin.x, y: origin.y + tile.height },
];

export { rectOutline };
