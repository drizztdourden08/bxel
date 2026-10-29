/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import type { HistoryDirection } from './editor.type';
import { stepSelection } from './selection/step-selection';

const stepHistory = (direction: HistoryDirection): void => {
  const { host, activeId } = useDocumentStore.getState();
  if (activeId === null || stepSelection(direction, activeId)) return;
  host[direction](activeId);
};

export { stepHistory };
