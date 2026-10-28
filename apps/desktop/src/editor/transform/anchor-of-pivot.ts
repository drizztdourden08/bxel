/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/raster';
import { ANCHOR_HALVES, ANCHORS } from './pivot-preset.constants';
import type { PivotAnchor } from './pivot-anchor.type';
import type { TransformSpec } from './transform.type';

const anchorOfPivot = (box: Rect, spec: TransformSpec): PivotAnchor | null => {
  const x2 = spec.pivot ? spec.pivot.x2 : 2 * box.x + box.width;
  const y2 = spec.pivot ? spec.pivot.y2 : 2 * box.y + box.height;
  const same = (anchor: PivotAnchor): boolean =>
    x2 === 2 * box.x + ANCHOR_HALVES[anchor].x * box.width && y2 === 2 * box.y + ANCHOR_HALVES[anchor].y * box.height;
  return ANCHORS.find(same) ?? null;
};

export { anchorOfPivot };
