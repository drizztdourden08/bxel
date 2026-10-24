/* @layer core @kind logic */
import type { TileShape, TileSize } from '../tilemap/tilemap.type';
import type { TiledShape } from './tiled.type';

const clamp = (value: number, high: number): number => Math.min(high, Math.max(0, Math.round(value)));

const rectCollision = (shape: Extract<TiledShape, { kind: 'rect' }>, tile: TileSize): TileShape | null => {
  const left = clamp(shape.x, tile.width);
  const top = clamp(shape.y, tile.height);
  const width = clamp(shape.x + shape.width, tile.width) - left;
  const height = clamp(shape.y + shape.height, tile.height) - top;
  if (width < 1 || height < 1) return null;
  return width === tile.width && height === tile.height ? { kind: 'full' } : { kind: 'rect', x: left, y: top, width, height };
};

const encloses = (points: readonly { x: number; y: number }[]): boolean => {
  const [first, second] = points;
  if (!first || !second) return false;
  const dx = second.x - first.x;
  const dy = second.y - first.y;
  return points.some((point) => dx * (point.y - first.y) - dy * (point.x - first.x) !== 0);
};

const polygonCollision = (shape: Extract<TiledShape, { kind: 'polygon' }>, tile: TileSize): TileShape | null => {
  const points = shape.points.map((point) => ({ x: clamp(point.x, tile.width), y: clamp(point.y, tile.height) }));
  return points.length >= 3 && encloses(points) ? { kind: 'polygon', points } : null;
};

const shapeToCollision = (shapes: readonly TiledShape[], tile: TileSize): TileShape | null => {
  const [first] = shapes;
  if (!first) return null;
  return first.kind === 'rect' ? rectCollision(first, tile) : polygonCollision(first, tile);
};

export { shapeToCollision };
