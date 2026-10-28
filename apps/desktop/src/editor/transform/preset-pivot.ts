/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/raster';
import { ANCHOR_HALVES } from './pivot-preset.constants';
import type { PivotAnchor } from './pivot-anchor.type';
import type { TransformSpec } from './transform.type';
import { withPivot } from './with-pivot';

const presetPivot = (box: Rect, spec: TransformSpec, anchor: PivotAnchor): TransformSpec => {
  const halves = ANCHOR_HALVES[anchor];
  return withPivot(box, spec, 2 * box.x + halves.x * box.width, 2 * box.y + halves.y * box.height);
};

export { presetPivot };
