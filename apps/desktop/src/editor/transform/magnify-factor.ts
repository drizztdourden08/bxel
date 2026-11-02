/* @layer renderer-app @kind logic */
import { SIZE_EPSILON } from './transform.constants';
import type { TransformSpec } from './transform.type';

const MIN_FACTOR = 2;

const isPlain = (spec: TransformSpec): boolean =>
  spec.corners === null && spec.pivot === null && spec.angle === 0 && spec.skew.x === 0 && spec.skew.y === 0 && spec.offset.x === 0 && spec.offset.y === 0;

const magnifyFactor = (spec: TransformSpec): number | null => {
  if (!isPlain(spec)) return null;
  const factor = Math.round(spec.scale.x);
  const whole = Math.abs(spec.scale.x - factor) < SIZE_EPSILON && Math.abs(spec.scale.y - factor) < SIZE_EPSILON;
  return whole && factor >= MIN_FACTOR ? factor : null;
};

export { magnifyFactor };
