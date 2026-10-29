/* @layer renderer-app @kind logic */
import type { Point, Rect } from '@bxel/raster';
import type { TransformSpec } from './transform.type';

const pivotPoint = (box: Rect, spec: TransformSpec): Point =>
  spec.pivot ? { x: spec.pivot.x2 / 2, y: spec.pivot.y2 / 2 } : { x: box.x + box.width / 2, y: box.y + box.height / 2 };

export { pivotPoint };
