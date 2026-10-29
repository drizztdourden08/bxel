/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/raster';
import { clampSpec } from './clamp-spec';
import { mapQuad } from './map-quad';
import { specBounds } from './spec-bounds';
import type { TransformField, TransformSpec } from './transform.type';

const signOf = (value: number): number => (value < 0 ? -1 : 1);

const resize = (spec: TransformSpec, axis: 'x' | 'y', size: number, extent: number): TransformSpec => {
  if (extent < 1) return spec;
  const factor = (signOf(spec.scale[axis]) * Math.max(1, Math.round(size))) / extent;
  return { ...spec, scale: { ...spec.scale, [axis]: factor } };
};

const place = (box: Rect, spec: TransformSpec, axis: 'x' | 'y', value: number): TransformSpec => {
  const area = specBounds(box, spec);
  const by = Math.round(value) - area[axis];
  if (spec.corners) return { ...spec, corners: mapQuad(spec.corners, (corner) => ({ ...corner, [axis]: corner[axis] + by })) };
  return { ...spec, offset: { ...spec.offset, [axis]: spec.offset[axis] + by } };
};

const applyField = (box: Rect, spec: TransformSpec, field: TransformField, value: number): TransformSpec => {
  switch (field) {
    case 'x':
      return place(box, spec, 'x', value);
    case 'y':
      return place(box, spec, 'y', value);
    case 'width':
      return clampSpec(resize(spec, 'x', value, box.width));
    case 'height':
      return clampSpec(resize(spec, 'y', value, box.height));
    case 'angle':
      return clampSpec({ ...spec, angle: value });
    case 'skewX':
      return clampSpec({ ...spec, skew: { ...spec.skew, x: value } });
    case 'skewY':
      return clampSpec({ ...spec, skew: { ...spec.skew, y: value } });
  }
};

export { applyField };
