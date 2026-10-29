/* @layer renderer-app @kind logic */
import { runsMask } from '@bxel/raster';
import type { CombineMode } from '@bxel/raster';
import { useNoticeStore } from '../../stores/useNoticeStore';
import { currentTarget } from '../current-target';
import { commitSelection } from './commit-selection';
import { mergeMask } from './merge-mask';
import { SELECTION_TEXT } from './selection.constants';
import { selectionMask } from './selection-mask';

const loadSavedSelection = (name: string, mode: CombineMode): boolean => {
  const target = currentTarget();
  const saved = target?.sprite.selections?.find((each) => each.name === name);
  if (!target || !saved) return false;
  if (saved.width !== target.sprite.width || saved.height !== target.sprite.height) {
    useNoticeStore.getState().post(SELECTION_TEXT.savedSizeChanged(name));
    return false;
  }
  commitSelection(target, mergeMask(selectionMask(target), runsMask(target.sprite, saved.runs), mode));
  return true;
};

export { loadSavedSelection };
