/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/raster';
import { specBounds } from './spec-bounds';
import { TENTH } from './transform.constants';
import type { TransformField, TransformSpec } from './transform.type';

const tenths = (value: number): number => Math.round(value * TENTH) / TENTH;

const fieldValue = (box: Rect, spec: TransformSpec, field: TransformField): number => {
  const area = specBounds(box, spec);
  switch (field) {
    case 'x':
      return area.x;
    case 'y':
      return area.y;
    case 'width':
      return spec.corners ? area.width : Math.round(Math.abs(spec.scale.x) * box.width);
    case 'height':
      return spec.corners ? area.height : Math.round(Math.abs(spec.scale.y) * box.height);
    case 'angle':
      return tenths(spec.angle);
    case 'skewX':
      return tenths(spec.skew.x);
    case 'skewY':
      return tenths(spec.skew.y);
  }
};

export { fieldValue };
