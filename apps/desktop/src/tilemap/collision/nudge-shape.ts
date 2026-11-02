/* @layer renderer-app @kind logic */
import type { Point, Size, TileShape } from '@bxel/document';

const clamp = (value: number, limit: number): number => Math.min(limit, Math.max(0, value));

const nudgeShape = (shape: TileShape, at: number | null, delta: Point, size: Size): TileShape => {
  if (shape.kind === 'full') return shape;
  if (shape.kind === 'rect') {
    return { ...shape, x: clamp(shape.x + delta.x, size.width - shape.width), y: clamp(shape.y + delta.y, size.height - shape.height) };
  }
  const move = (point: Point): Point => ({ x: clamp(point.x + delta.x, size.width), y: clamp(point.y + delta.y, size.height) });
  return { ...shape, points: shape.points.map((point, index) => (at === null || index === at ? move(point) : point)) };
};

export { nudgeShape };
