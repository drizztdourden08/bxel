/* @layer renderer-app @kind logic */
import type { Point, Quad } from '@bxel/raster';
import type { Handle } from './transform.type';

interface HandlePoint {
  handle: Handle;
  at: Point;
}

const middle = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

/** The four corner handles, then the four edge handles (top, right, bottom, left). */
const handlePoints = (quad: Quad): HandlePoint[] => [
  ...quad.map((at, index) => ({ handle: { kind: 'corner' as const, index }, at })),
  ...quad.map((at, index) => ({ handle: { kind: 'edge' as const, index }, at: middle(at, quad[(index + 1) % 4] as Point) })),
];

export { handlePoints };
export type { HandlePoint };
