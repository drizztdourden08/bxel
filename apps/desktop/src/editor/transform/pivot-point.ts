/* @layer renderer-app @kind logic */
import type { Point, Rect } from '@bxel/raster';
import type { TransformSpec } from './transform.type';

/** The fixed point of the transform, before the offset: the middle of the box unless the pivot was moved. */
const pivotPoint = (box: Rect, spec: TransformSpec): Point =>
  spec.pivot ? { x: spec.pivot.x2 / 2, y: spec.pivot.y2 / 2 } : { x: box.x + box.width / 2, y: box.y + box.height / 2 };

export { pivotPoint };
