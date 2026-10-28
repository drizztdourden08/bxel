/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { clampSpec } from './clamp-spec';
import { dragBody } from './drag-body';
import { dragDistort } from './drag-distort';
import { dragPivot } from './drag-pivot';
import { dragRotate } from './drag-rotate';
import { dragScale } from './drag-scale';
import { dragSkew } from './drag-skew';
import type { Grab, HeldKeys, TransformSpec } from './transform.type';

const resized = (grab: Grab, pointer: Point, keys: HeldKeys): TransformSpec => {
  if (grab.mode === 'distort') return dragDistort(grab, pointer);
  return grab.mode === 'skew' ? dragSkew(grab, pointer) : dragScale(grab, pointer, keys);
};

const apply = (grab: Grab, pointer: Point, keys: HeldKeys): TransformSpec => {
  const { kind } = grab.handle;
  if (kind === 'pivot') return dragPivot(grab, pointer);
  if (kind === 'rotate') return dragRotate(grab, pointer, keys);
  return kind === 'body' ? dragBody(grab, pointer, keys) : resized(grab, pointer, keys);
};

const dragTransform = (grab: Grab, pointer: Point, keys: HeldKeys): TransformSpec => clampSpec(apply(grab, pointer, keys));

export { dragTransform };
