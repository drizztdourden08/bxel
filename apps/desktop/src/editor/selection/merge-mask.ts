/* @layer renderer-app @kind logic */
import { combineMasks, maskBounds } from '@bxel/raster';
import type { CombineMode, MaskView } from '@bxel/raster';

const filled = (mask: MaskView): MaskView | null => (maskBounds(mask) === null ? null : mask);

const mergeMask = (base: MaskView | null, incoming: MaskView, mode: CombineMode): MaskView | null => {
  if (!base) return mode === 'replace' || mode === 'add' ? filled(incoming) : null;
  return filled(combineMasks(base, incoming, mode));
};

export { mergeMask };
