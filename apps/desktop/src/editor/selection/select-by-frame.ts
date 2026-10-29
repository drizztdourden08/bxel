/* @layer renderer-app @kind logic */
import { useSelectionStore } from '../../stores/useSelectionStore';
import { currentTarget } from '../current-target';
import { commitSelection } from './commit-selection';
import { framesOpaque } from './frames-opaque';
import { mergeMask } from './merge-mask';
import { selectionMask } from './selection-mask';

const selectByFrame = (): void => {
  const target = currentTarget();
  if (target) commitSelection(target, mergeMask(selectionMask(target), framesOpaque(target), useSelectionStore.getState().mode));
};

export { selectByFrame };
