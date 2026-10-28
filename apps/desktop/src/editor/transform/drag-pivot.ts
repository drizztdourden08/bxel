/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { PIVOT_STEP } from './transform.constants';
import type { Grab, TransformSpec } from './transform.type';
import { withPivot } from './with-pivot';

const snapped = (value: number): number => Math.round(value / PIVOT_STEP) * PIVOT_STEP;

const dragPivot = (grab: Grab, pointer: Point): TransformSpec => {
  const at = { x: pointer.x - grab.spec.offset.x, y: pointer.y - grab.spec.offset.y };
  return withPivot(grab.box, grab.spec, Math.round(snapped(at.x) * 2), Math.round(snapped(at.y) * 2));
};

export { dragPivot };
