/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { applyMatrix } from './apply-matrix';
import { edgeMiddle } from './edge-middle';
import { invertMatrix } from './invert-matrix';
import { mapPoint } from './map-point';
import { pivotPoint } from './pivot-point';
import { sizeScale } from './size-scale';
import { boxCorners } from './box-corners';
import type { Grab, HeldKeys, TransformSpec } from './transform.type';
import { transformMatrix } from './transform-matrix';
import { turnSkewMatrix } from './turn-skew-matrix';

const grabbedPoint = (grab: Grab, index: number): Point => {
  const corners = boxCorners(grab.box);
  return grab.handle.kind === 'corner' ? (corners[index % 4] as Point) : edgeMiddle(corners, index % 4);
};

const keepRatio = (spec: TransformSpec, next: Point): Point => {
  const across = next.x / spec.scale.x;
  const down = next.y / spec.scale.y;
  const factor = Math.abs(across) >= Math.abs(down) ? across : down;
  return { x: spec.scale.x * factor, y: spec.scale.y * factor };
};

const onlyAxis = (grab: Grab, next: Point): Point => {
  const vertical = grab.handle.index % 2 === 0;
  return vertical ? { x: grab.spec.scale.x, y: next.y } : { x: next.x, y: grab.spec.scale.y };
};

const dragScale = (grab: Grab, pointer: Point, keys: HeldKeys): TransformSpec => {
  const { spec, box, handle } = grab;
  const inverse = invertMatrix(turnSkewMatrix(spec));
  if (!inverse) return spec;
  const grabbed = grabbedPoint(grab, handle.index);
  const anchor = keys.altKey ? pivotPoint(box, spec) : grabbedPoint({ ...grab, handle: { ...handle, index: handle.index + 2 } }, handle.index + 2);
  const pivot = pivotPoint(box, spec);
  const anchorAt = keys.altKey ? { x: pivot.x + spec.offset.x, y: pivot.y + spec.offset.y } : mapPoint(box, spec, anchor);
  const local = applyMatrix(inverse, { x: pointer.x - anchorAt.x, y: pointer.y - anchorAt.y });
  const span = { x: grabbed.x - anchor.x, y: grabbed.y - anchor.y };
  const wanted = sizeScale({ local, span, box, spec });
  const scale = handle.kind === 'edge' ? onlyAxis(grab, wanted) : keys.shiftKey ? keepRatio(spec, wanted) : wanted;
  const next = { ...spec, scale };
  if (keys.altKey) return next;
  const m = transformMatrix(next);
  const offset = {
    x: anchorAt.x - pivot.x - (m[0] * (anchor.x - pivot.x) + m[1] * (anchor.y - pivot.y)),
    y: anchorAt.y - pivot.y - (m[2] * (anchor.x - pivot.x) + m[3] * (anchor.y - pivot.y)),
  };
  return { ...next, offset };
};

export { dragScale };
