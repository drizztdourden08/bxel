/* @layer renderer-app @kind logic */
import { smoothMask } from '@bxel/raster';
import { currentTarget } from '../current-target';
import { commitSelection } from './commit-selection';
import { selectionMask } from './selection-mask';

const smoothSelection = (): void => {
  const target = currentTarget();
  const mask = target ? selectionMask(target) : null;
  if (target && mask) commitSelection(target, smoothMask(mask));
};

export { smoothSelection };
