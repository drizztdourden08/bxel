/* @layer renderer-app @kind logic */
import { useSelectionStore } from '../../stores/useSelectionStore';
import { currentTarget } from '../current-target';
import { commitSelection } from './commit-selection';

const clearSelection = (): void => {
  const target = currentTarget();
  if (target) commitSelection(target, null);
  else useSelectionStore.getState().setMask(null, null);
};

export { clearSelection };
