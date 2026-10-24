/* @layer renderer-app @kind logic */
import { fullMask } from '@bxel/raster';
import { selectAllSprites } from '../../sheet/select-all-sprites';
import { useSpriteStore } from '../../stores/useSpriteStore';
import { currentTarget } from '../current-target';
import { spritesFocused } from '../focus/sprites-focused';
import { setSelection } from './set-selection';

const selectAll = (): void => {
  if (useSpriteStore.getState().mode === 'sheet' || spritesFocused()) {
    selectAllSprites();
    return;
  }
  const target = currentTarget();
  if (target) setSelection(target, fullMask(target.sprite));
};

export { selectAll };
