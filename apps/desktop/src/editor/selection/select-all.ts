/* @layer renderer-app @kind logic */
import { fullMask } from '@bxel/raster';
import { selectAllSprites } from '../../sheet/select-all-sprites';
import { useSpriteStore } from '../../stores/useSpriteStore';
import { currentTarget } from '../current-target';
import { commitSelection } from './commit-selection';

const selectAll = (): void => {
  if (useSpriteStore.getState().mode === 'sheet') {
    selectAllSprites();
    return;
  }
  const target = currentTarget();
  if (target) commitSelection(target, fullMask(target.sprite));
};

export { selectAll };
