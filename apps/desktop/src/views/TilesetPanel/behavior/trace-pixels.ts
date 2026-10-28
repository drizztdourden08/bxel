/* @layer renderer-app @kind logic */
import { MAX_COLLISION_POINTS } from '@bxel/document';
import type { Point, TileCollision } from '@bxel/document';

const cross = (origin: Point, a: Point, b: Point): number => (a.x - origin.x) * (b.y - origin.y) - (a.y - origin.y) * (b.x - origin.x);

const half = (points: readonly Point[]): Point[] => {
  const chain: Point[] = [];
  for (const point of points) {
    while (chain.length >= 2 && cross(chain[chain.length - 2] as Point, chain[chain.length - 1] as Point, point) <= 0) chain.pop();
    chain.push(point);
  }
  chain.pop();
  return chain;
};

const hullOf = (points: readonly Point[]): Point[] => {
  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  return [...half(sorted), ...half([...sorted].reverse())];
};

const area = (a: Point, b: Point, c: Point): number => Math.abs(cross(a, b, c));

const thinned = (hull: Point[]): Point[] => {
  const points = [...hull];
  while (points.length > MAX_COLLISION_POINTS) {
    let best = 0;
    let least = Infinity;
    points.forEach((point, at) => {
      const size = area(points[(at + points.length - 1) % points.length] as Point, point, points[(at + 1) % points.length] as Point);
      if (size < least) {
        least = size;
        best = at;
      }
    });
    points.splice(best, 1);
  }
  return points;
};

const traceBox = (opaque: readonly Point[]): TileCollision => {
  const left = Math.min(...opaque.map((point) => point.x));
  const top = Math.min(...opaque.map((point) => point.y));
  const right = Math.max(...opaque.map((point) => point.x)) + 1;
  const bottom = Math.max(...opaque.map((point) => point.y)) + 1;
  return { kind: 'rect', x: left, y: top, width: right - left, height: bottom - top };
};

const tracePixels = (indices: Uint8Array, width: number): TileCollision | null => {
  const opaque: Point[] = [];
  indices.forEach((index, at) => {
    if (index !== 0) opaque.push({ x: at % width, y: Math.floor(at / width) });
  });
  if (opaque.length === 0) return null;
  const corners = opaque.flatMap((point) => [point, { x: point.x + 1, y: point.y }, { x: point.x + 1, y: point.y + 1 }, { x: point.x, y: point.y + 1 }]);
  const hull = thinned(hullOf(corners));
  const box = traceBox(opaque);
  const boxed = box.kind === 'rect' && hull.length === 4 && hull.every((point) => (point.x === box.x || point.x === box.x + box.width) && (point.y === box.y || point.y === box.y + box.height));
  return hull.length < 3 || boxed ? box : { kind: 'polygon', points: hull };
};

export { tracePixels };
