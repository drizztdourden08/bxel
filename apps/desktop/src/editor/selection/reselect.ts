/* @layer renderer-app @kind logic */
import { useSelectionHistoryStore } from '../../stores/useSelectionHistoryStore';
import { currentTarget } from '../current-target';
import { commitSelection } from './commit-selection';

const reselect = (): boolean => {
  const target = currentTarget();
  const { last } = useSelectionHistoryStore.getState();
  if (!target || last?.width !== target.sprite.width || last.height !== target.sprite.height) return false;
  commitSelection(target, last);
  return true;
};

export { reselect };
