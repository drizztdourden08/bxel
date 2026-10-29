/* @layer renderer-app @kind logic */
import type { BoundsPolicy, ResampleAlgorithm } from '@bxel/raster';
import { IDENTITY } from './transform.constants';
import type { TransformSpec } from './transform.type';

const rotateSpec = (angle: number, bounds: BoundsPolicy, algorithm: ResampleAlgorithm = 'nearest'): TransformSpec => ({ ...IDENTITY, angle, bounds, algorithm });

export { rotateSpec };
