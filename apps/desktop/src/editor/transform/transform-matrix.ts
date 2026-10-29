/* @layer renderer-app @kind logic */
import { affineMatrix } from '@bxel/raster';
import type { Matrix2 } from '@bxel/raster';
import type { TransformSpec } from './transform.type';

const transformMatrix = (spec: TransformSpec): Matrix2 =>
  affineMatrix({ scale: spec.scale, angle: spec.angle, skew: spec.skew, offset: spec.offset });

export { transformMatrix };
