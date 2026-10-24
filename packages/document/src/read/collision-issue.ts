/* @layer core @kind logic */
import type { Point, Size } from '../model/geometry.type';
import type { TileCollision } from '../model/tilemap.type';
import { MAX_COLLISION_POINTS } from '../model/tilemap-limits.constants';

const twiceArea = (points: readonly Point[]): number =>
  points.reduce((sum, point, at) => {
    const next = points[(at + 1) % points.length] ?? point;
    return sum + point.x * next.y - next.x * point.y;
  }, 0);

const outside = (point: Point, tile: Size): boolean => point.x < 0 || point.y < 0 || point.x > tile.width || point.y > tile.height;

const rectIssue = (rect: Extract<TileCollision, { kind: 'rect' }>, tile: Size): string | null => {
  const far = { x: rect.x + rect.width, y: rect.y + rect.height };
  const fits = rect.width >= 1 && rect.height >= 1 && !outside(rect, tile) && !outside(far, tile);
  return fits ? null : `A collision rectangle lies inside the ${tile.width} x ${tile.height} tile.`;
};

const collisionIssue = (collision: TileCollision, tile: Size): string | null => {
  if (collision.kind === 'full') return null;
  if (collision.kind === 'rect') return rectIssue(collision, tile);
  const { points } = collision;
  if (points.length < 3 || points.length > MAX_COLLISION_POINTS) return `A collision polygon has 3 to ${MAX_COLLISION_POINTS} points.`;
  if (points.some((point) => outside(point, tile))) return `Every collision point lies inside the ${tile.width} x ${tile.height} tile.`;
  return twiceArea(points) === 0 ? 'A collision polygon encloses an area.' : null;
};

export { collisionIssue };
