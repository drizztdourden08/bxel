/* @layer renderer-app @kind logic */
import type { MaskView } from '@bxel/raster';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { useToolStore } from '../../stores/useToolStore';
import { symmetryOf } from '../symmetry-of';
import { mirrorMask } from './mirror-mask';

const mirroredIncoming = (mask: MaskView): MaskView => {
  if (!useSelectionStore.getState().mirror) return mask;
  return mirrorMask(mask, symmetryOf(useToolStore.getState(), mask));
};

export { mirroredIncoming };
