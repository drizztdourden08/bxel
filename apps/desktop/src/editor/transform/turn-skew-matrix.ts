/* @layer renderer-app @kind logic */
import type { Matrix2 } from '@bxel/raster';
import { transformMatrix } from './transform-matrix';
import type { TransformSpec } from './transform.type';

const turnSkewMatrix = (spec: TransformSpec): Matrix2 => transformMatrix({ ...spec, scale: { x: 1, y: 1 } });

export { turnSkewMatrix };
