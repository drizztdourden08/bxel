/* @layer renderer-app @kind logic */
import { FLIP_ORIENTATION, TURN_ORIENTATION, transformMask } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import type { EditorTarget } from '../editor.type';
import type { PendingEdit } from './pending.type';
import { placeClip } from './place-clip';
import { shiftMask } from './shift-mask';

const pendingLanding = (target: EditorTarget, pending: PendingEdit): MaskView | null => {
  const { spec, mask } = pending;
  if (spec.kind === 'paste') return placeClip(spec.clip, spec.offset, target.sprite);
  if (!mask) return null;
  if (spec.kind === 'flip') return transformMask(mask, FLIP_ORIENTATION[spec.axis]);
  if (spec.kind === 'turn') return transformMask(mask, TURN_ORIENTATION[spec.direction]);
  return spec.kind === 'move' ? shiftMask(mask, spec.offset) : null;
};

export { pendingLanding };
