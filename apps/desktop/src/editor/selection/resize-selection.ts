/* @layer renderer-app @kind logic */
import { expandMask, shrinkMask } from '@bxel/raster';
import { currentTarget } from '../current-target';
import { selectionMask } from './selection-mask';
import { setSelection } from './set-selection';

const resizeSelection = (pixels: number): void => {
  const target = currentTarget();
  const mask = target ? selectionMask(target) : null;
  if (!target || !mask) return;
  setSelection(target, pixels >= 0 ? expandMask(mask, pixels) : shrinkMask(mask, -pixels));
};

export { resizeSelection };
