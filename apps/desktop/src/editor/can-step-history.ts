/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import type { HistoryDirection } from './editor.type';

const canStepHistory = (direction: HistoryDirection): boolean => {
  const { host, activeId } = useDocumentStore.getState();
  const view = activeId === null ? undefined : host.view(activeId);
  if (!view) return false;
  return direction === 'undo' ? view.canUndo : view.canRedo;
};

export { canStepHistory };
