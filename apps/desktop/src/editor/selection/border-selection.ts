/* @layer renderer-app @kind logic */
import { borderMask } from '@bxel/raster';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { currentTarget } from '../current-target';
import { commitSelection } from './commit-selection';
import { selectionMask } from './selection-mask';

const borderSelection = (): void => {
  const target = currentTarget();
  const mask = target ? selectionMask(target) : null;
  if (target && mask) commitSelection(target, borderMask(mask, useSelectionStore.getState().amount));
};

export { borderSelection };
