/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { useTransformUiStore } from '../../stores/useTransformUiStore';
import { pivotPoint } from './pivot-point';
import { snapAngle } from './snap-angle';
import { HALF_TURN_DEGREES } from './transform.constants';
import type { Grab, HeldKeys, TransformSpec } from './transform.type';

const angleAround = (centre: Point, point: Point): number => (Math.atan2(point.y - centre.y, point.x - centre.x) * HALF_TURN_DEGREES) / Math.PI;

const dragRotate = (grab: Grab, pointer: Point, keys: HeldKeys): TransformSpec => {
  const { spec } = grab;
  if (spec.corners) return spec;
  const pivot = pivotPoint(grab.box, spec);
  const centre = { x: pivot.x + spec.offset.x, y: pivot.y + spec.offset.y };
  const turned = angleAround(centre, pointer) - angleAround(centre, grab.start);
  const angle = spec.angle + turned;
  return { ...spec, angle: keys.shiftKey ? snapAngle(angle, useTransformUiStore.getState().angleSnap) : Math.round(angle * 10) / 10 };
};

export { dragRotate };
