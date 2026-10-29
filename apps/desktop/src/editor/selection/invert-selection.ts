/* @layer renderer-app @kind logic */
import { emptyMask, invertMask } from '@bxel/raster';
import { currentTarget } from '../current-target';
import { selectionMask } from './selection-mask';
import { commitSelection } from './commit-selection';

const invertSelection = (): void => {
  const target = currentTarget();
  if (target) commitSelection(target, invertMask(selectionMask(target) ?? emptyMask(target.sprite)));
};

export { invertSelection };
