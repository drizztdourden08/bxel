/* @layer core @kind logic */
import { dropCorner } from './drop-corner';
import type { Point } from './geometry.type';
import { linePoints } from './line-points';
import type { PerfectTrail, TrailChange } from './perfect-trail.type';

const segmentTo = (trail: PerfectTrail, raw: Point): Point[] =>
  trail.last
    ? linePoints({ from: trail.last, to: raw }).slice(1)
    : [{ x: Math.trunc(raw.x), y: Math.trunc(raw.y) }];

const extendTrail = (trail: PerfectTrail, raw: Point): TrailChange => {
  const segment = segmentTo(trail, raw);
  const { kept } = trail;
  const removed: Point[] = [];
  let settled = kept.length;
  for (const point of segment) {
    const dropped = dropCorner(kept, point);
    if (dropped && kept.length < settled) {
      removed.push(dropped);
      settled = kept.length;
    }
    kept.push(point);
  }
  trail.last = raw;
  return { removed, added: kept.slice(settled) };
};

export { extendTrail };
