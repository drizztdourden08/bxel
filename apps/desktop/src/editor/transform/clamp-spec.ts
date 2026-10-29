/* @layer renderer-app @kind logic */
import { ANGLE_LIMIT, SCALE_LIMIT, SKEW_LIMIT } from './transform.constants';
import type { TransformSpec } from './transform.type';

const within = (value: number, limit: number): number => Math.max(-limit, Math.min(limit, value));

const keepAway = (value: number): number => (Math.abs(value) < 1 / SCALE_LIMIT ? (value < 0 ? -1 : 1) / SCALE_LIMIT : value);

const clampSpec = (spec: TransformSpec): TransformSpec => ({
  ...spec,
  angle: within(spec.angle % (ANGLE_LIMIT + 1), ANGLE_LIMIT),
  scale: { x: keepAway(within(spec.scale.x, SCALE_LIMIT)), y: keepAway(within(spec.scale.y, SCALE_LIMIT)) },
  skew: { x: within(spec.skew.x, SKEW_LIMIT), y: within(spec.skew.y, SKEW_LIMIT) },
});

export { clampSpec };
