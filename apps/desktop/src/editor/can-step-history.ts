/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import type { HistoryDirection } from './editor.type';
import { canStepSelection } from './selection/can-step-selection';

const canStepHistory = (direction: HistoryDirection): boolean => {
  const { host, activeId } = useDocumentStore.getState();
  const view = activeId === null ? undefined : host.view(activeId);
  if (!view || activeId === null) return false;
  if (canStepSelection(direction, activeId)) return true;
  return direction === 'undo' ? view.canUndo : view.canRedo;
};

export { canStepHistory };
