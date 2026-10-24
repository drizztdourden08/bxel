/* @layer renderer-app @kind logic */
import { fullMask } from '@bxel/raster';
import { currentTarget } from '../current-target';
import { setSelection } from './set-selection';

const selectAll = (): void => {
  const target = currentTarget();
  if (target) setSelection(target, fullMask(target.sprite));
};

export { selectAll };
