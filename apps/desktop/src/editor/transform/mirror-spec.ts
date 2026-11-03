/* @layer renderer-app @kind logic */
import type { FlipAxis, TurnDirection } from '@bxel/document';
import type { PointMap, Rect } from '@bxel/raster';
import type { PendingSpec } from '../pending/pending.type';
import { mirrorQuad } from './mirror-quad';
import { specQuad } from './spec-quad';
import { MAGNIFY_ALGORITHMS } from './transform.constants';
import type { TransformSpec } from './transform.type';

const swapsAxes = (map: PointMap): boolean => map({ x: 1, y: 0 }).x === map({ x: 0, y: 0 }).x;

const reverses = (map: PointMap): boolean => {
  const origin = map({ x: 0, y: 0 });
  const right = map({ x: 1, y: 0 });
  const down = map({ x: 0, y: 1 });
  return (right.x - origin.x) * (down.y - origin.y) - (right.y - origin.y) * (down.x - origin.x) < 0;
};

const turned = (direction: TurnDirection): TurnDirection => {
  if (direction === 'half') return 'half';
  return direction === 'clockwise' ? 'counter-clockwise' : 'clockwise';
};

const flipped = (axis: FlipAxis): FlipAxis => (axis === 'horizontal' ? 'vertical' : 'horizontal');

const mirrorTransform = (spec: TransformSpec, box: Rect, mirrored: Rect, map: PointMap): TransformSpec => {
  const algorithm = MAGNIFY_ALGORITHMS.includes(spec.algorithm) ? 'nearest' : spec.algorithm;
  return { ...spec, algorithm, corners: mirrorQuad(specQuad(box, spec), box, mirrored, map) };
};

const mirrorSpec = (spec: PendingSpec, box: Rect, mirrored: Rect, map: PointMap): PendingSpec | null => {
  if (spec.kind === 'flip') return swapsAxes(map) ? { kind: 'flip', axis: flipped(spec.axis) } : spec;
  if (spec.kind === 'turn') return reverses(map) ? { kind: 'turn', direction: turned(spec.direction) } : spec;
  return spec.kind === 'transform' ? mirrorTransform(spec, box, mirrored, map) : null;
};

export { mirrorSpec };
