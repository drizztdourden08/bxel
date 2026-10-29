/* @layer renderer-app @kind logic */
import type { Point, TileShape } from '@bxel/document';

const inside = (points: readonly Point[], x: number, y: number): boolean => {
  let hit = false;
  points.forEach((point, index) => {
    const other = points[(index + points.length - 1) % points.length] ?? point;
    if (point.y > y !== other.y > y && x < ((other.x - point.x) * (y - point.y)) / (other.y - point.y) + point.x) hit = !hit;
  });
  return hit;
};

const shapeCovers = (shape: TileShape, tile: { width: number; height: number }, pixel: Point): boolean => {
  const x = pixel.x + 0.5;
  const y = pixel.y + 0.5;
  if (shape.kind === 'full') return true;
  if (shape.kind === 'rect') return x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height;
  return inside(shape.points, x, y) && x <= tile.width && y <= tile.height;
};

export { shapeCovers };
