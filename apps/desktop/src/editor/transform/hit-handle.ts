/* @layer renderer-app @kind logic */
import type { Point, Quad } from '@bxel/raster';
import { handlePoints } from './handle-points';
import { insideQuad } from './inside-quad';
import { HANDLE_REACH, NO_INDEX, ROTATE_REACH } from './transform.constants';
import type { Handle } from './transform.type';

const distance = (a: Point, b: Point): number => Math.hypot(a.x - b.x, a.y - b.y);

interface HitRequest {
  quad: Quad;
  pivot: Point;
  point: Point;
  zoom: number;
}

/** The part of the transform box under the pointer. Reaches are in screen pixels, so they shrink with zoom. */
const hitHandle = ({ quad, pivot, point, zoom }: HitRequest): Handle | null => {
  const reach = HANDLE_REACH / zoom;
  if (distance(pivot, point) <= reach) return { kind: 'pivot', index: NO_INDEX };
  const near = handlePoints(quad)
    .map((each) => ({ handle: each.handle, gap: distance(each.at, point) }))
    .filter((each) => each.gap <= reach)
    .sort((a, b) => a.gap - b.gap)[0];
  if (near) return near.handle;
  if (insideQuad(quad, point)) return { kind: 'body', index: NO_INDEX };
  const corner = quad.findIndex((each) => distance(each, point) <= ROTATE_REACH / zoom);
  return corner >= 0 ? { kind: 'rotate', index: corner } : null;
};

export { hitHandle };
