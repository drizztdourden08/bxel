/* @layer renderer-app @kind logic */
import type { Point, Quad } from '@bxel/raster';
import type { HandlePoint } from './handle-points.type';

const middle = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

const handlePoints = (quad: Quad): HandlePoint[] => [
  ...quad.map((at, index) => ({ handle: { kind: 'corner' as const, index }, at })),
  ...quad.map((at, index) => ({ handle: { kind: 'edge' as const, index }, at: middle(at, quad[(index + 1) % 4] as Point) })),
];

export { handlePoints };
