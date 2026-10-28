/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { applyMatrix } from './apply-matrix';
import { edgeMiddle } from './edge-middle';
import { boxCorners } from './box-corners';
import { invertMatrix } from './invert-matrix';
import { pivotPoint } from './pivot-point';
import { HALF_TURN_DEGREES } from './transform.constants';
import { transformMatrix } from './transform-matrix';
import type { Grab, TransformSpec } from './transform.type';

const degrees = (slope: number): number => (Math.atan(slope) * HALF_TURN_DEGREES) / Math.PI;

const turnOnly = (spec: TransformSpec) => transformMatrix({ ...spec, scale: { x: 1, y: 1 }, skew: { x: 0, y: 0 } });

const dragSkew = (grab: Grab, pointer: Point): TransformSpec => {
  const { spec, box, handle } = grab;
  const inverse = invertMatrix(turnOnly(spec));
  if (!inverse) return spec;
  const pivot = pivotPoint(box, spec);
  const edge = edgeMiddle(boxCorners(box), handle.index);
  const rel = { x: edge.x - pivot.x, y: edge.y - pivot.y };
  const centre = { x: pivot.x + spec.offset.x, y: pivot.y + spec.offset.y };
  const local = applyMatrix(inverse, { x: pointer.x - centre.x, y: pointer.y - centre.y });
  const horizontal = handle.index % 2 === 0;
  if (horizontal && Math.abs(spec.scale.y * rel.y) > 0) {
    return { ...spec, skew: { ...spec.skew, x: degrees((local.x - spec.scale.x * rel.x) / (spec.scale.y * rel.y)) } };
  }
  if (!horizontal && Math.abs(spec.scale.x * rel.x) > 0) {
    return { ...spec, skew: { ...spec.skew, y: degrees((local.y - spec.scale.y * rel.y) / (spec.scale.x * rel.x)) } };
  }
  return spec;
};

export { dragSkew };
