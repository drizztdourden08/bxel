/* @layer renderer-app @kind constants */
import type { BoundsPolicy, ResampleAlgorithm } from '@bxel/raster';
import type { TransformSpec } from './transform.type';

const ROTATE_START = 0;

const ANGLE_SNAP = 15;

const ANGLE_LIMIT = 360;

const SKEW_LIMIT = 80;

const SCALE_LIMIT = 64;

const PIVOT_STEP = 0.5;

const SIZE_EPSILON = 1e-6;

const NO_INDEX = -1;

const HALF_TURN_DEGREES = 180;

const TENTH = 10;

const HANDLE_REACH = 7;

const ROTATE_REACH = 22;

const DEFAULT_ALGORITHM: ResampleAlgorithm = 'rotsprite';

const DEFAULT_BOUNDS: BoundsPolicy = 'crop';

const IDENTITY: TransformSpec = {
  kind: 'transform',
  scale: { x: 1, y: 1 },
  angle: ROTATE_START,
  skew: { x: 0, y: 0 },
  offset: { x: 0, y: 0 },
  pivot: null,
  algorithm: DEFAULT_ALGORITHM,
  bounds: DEFAULT_BOUNDS,
  corners: null,
};

export { ANGLE_LIMIT, ANGLE_SNAP, HALF_TURN_DEGREES, TENTH, HANDLE_REACH, IDENTITY, NO_INDEX, PIVOT_STEP, ROTATE_REACH, SCALE_LIMIT, SIZE_EPSILON, SKEW_LIMIT };
