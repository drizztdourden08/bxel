/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/raster';
import { pivotPoint } from './pivot-point';
import { transformMatrix } from './transform-matrix';
import type { TransformSpec } from './transform.type';

const withPivot = (box: Rect, spec: TransformSpec, x2: number, y2: number): TransformSpec => {
  const m = transformMatrix(spec);
  const before = pivotPoint(box, spec);
  const gap = { x: before.x - x2 / 2, y: before.y - y2 / 2 };
  const offset = {
    x: spec.offset.x + gap.x - (m[0] * gap.x + m[1] * gap.y),
    y: spec.offset.y + gap.y - (m[2] * gap.x + m[3] * gap.y),
  };
  return { ...spec, pivot: { x2, y2 }, offset };
};

export { withPivot };
