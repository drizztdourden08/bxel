/* @layer renderer-app @kind logic */
import type { Point, Quad } from '@bxel/raster';
import type { Grab, HeldKeys, TransformSpec } from './transform.type';

const moveCorners = (corners: Quad, by: Point): Quad => [
  { x: corners[0].x + by.x, y: corners[0].y + by.y },
  { x: corners[1].x + by.x, y: corners[1].y + by.y },
  { x: corners[2].x + by.x, y: corners[2].y + by.y },
  { x: corners[3].x + by.x, y: corners[3].y + by.y },
];

const lockedDelta = (delta: Point, locked: boolean): Point => {
  if (!locked) return delta;
  return Math.abs(delta.x) >= Math.abs(delta.y) ? { x: delta.x, y: 0 } : { x: 0, y: delta.y };
};

const dragBody = (grab: Grab, pointer: Point, keys: HeldKeys): TransformSpec => {
  const raw = { x: Math.round(pointer.x - grab.start.x), y: Math.round(pointer.y - grab.start.y) };
  const delta = lockedDelta(raw, keys.shiftKey);
  const { spec } = grab;
  if (spec.corners) return { ...spec, corners: moveCorners(spec.corners, delta) };
  return { ...spec, offset: { x: spec.offset.x + delta.x, y: spec.offset.y + delta.y } };
};

export { dragBody };
