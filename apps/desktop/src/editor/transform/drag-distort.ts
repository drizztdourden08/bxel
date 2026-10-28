/* @layer renderer-app @kind logic */
import type { Point, Quad } from '@bxel/raster';
import { PIVOT_STEP } from './transform.constants';
import type { Grab, TransformSpec } from './transform.type';

const snapped = (value: number): number => Math.round(value / PIVOT_STEP) * PIVOT_STEP;

const put = (corners: Quad, index: number, to: Point): Quad =>
  corners.map((corner, at) => (at === index ? to : corner)) as unknown as Quad;

const dragDistort = (grab: Grab, pointer: Point): TransformSpec => {
  const { spec, handle } = grab;
  if (!spec.corners) return spec;
  if (handle.kind === 'corner') return { ...spec, corners: put(spec.corners, handle.index, { x: snapped(pointer.x), y: snapped(pointer.y) }) };
  const delta = { x: Math.round(pointer.x - grab.start.x), y: Math.round(pointer.y - grab.start.y) };
  const first = spec.corners[handle.index % 4] as Point;
  const second = spec.corners[(handle.index + 1) % 4] as Point;
  const moved = put(spec.corners, handle.index % 4, { x: first.x + delta.x, y: first.y + delta.y });
  return { ...spec, corners: put(moved, (handle.index + 1) % 4, { x: second.x + delta.x, y: second.y + delta.y }) };
};

export { dragDistort };
