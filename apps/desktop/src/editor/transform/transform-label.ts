/* @layer renderer-app @kind logic */
import { TRANSFORM_LABELS } from './transform-label.constants';
import type { TransformSpec } from './transform.type';

const transformLabel = (spec: TransformSpec): string => {
  if (spec.corners) return TRANSFORM_LABELS.distort;
  const turned = spec.angle !== 0;
  const scaled = spec.scale.x !== 1 || spec.scale.y !== 1;
  const skewed = spec.skew.x !== 0 || spec.skew.y !== 0;
  if (turned && !scaled && !skewed) return TRANSFORM_LABELS.rotate(spec.angle);
  if (scaled && !turned && !skewed) return TRANSFORM_LABELS.scale;
  return TRANSFORM_LABELS.transform;
};

export { transformLabel };
