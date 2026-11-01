/* @layer renderer-app @kind logic */
import { FLIP_ORIENTATION, TURN_ORIENTATION, combineMasks, transformMask } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import { clipMask } from '../clip-mask';
import type { EditorTarget } from '../editor.type';
import type { PendingEdit } from './pending.type';
import { placeClip } from './place-clip';
import { shiftMask } from './shift-mask';
import { transformLanding } from '../transform/transform-landing';

const pendingLanding = (target: EditorTarget, pending: PendingEdit): MaskView | null => {
  const { spec, mask } = pending;
  if (spec.kind === 'paste') {
    const placed = placeClip(spec.clip, spec.offset, target.sprite);
    const limit = clipMask(target);
    return limit ? combineMasks(placed, limit, 'intersect') : placed;
  }
  if (spec.kind === 'patch') return null;
  if (spec.kind === 'transform') return mask ? transformLanding(target, mask, spec) : null;
  if (!mask) return null;
  if (spec.kind === 'flip') return transformMask(mask, FLIP_ORIENTATION[spec.axis]);
  if (spec.kind === 'turn') return transformMask(mask, TURN_ORIENTATION[spec.direction]);
  return shiftMask(mask, spec.offset);
};

export { pendingLanding };
