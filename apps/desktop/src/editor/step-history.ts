/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import type { HistoryDirection } from './editor.type';

const stepHistory = (direction: HistoryDirection): void => {
  const { host, activeId } = useDocumentStore.getState();
  if (activeId !== null) host[direction](activeId);
};

export { stepHistory };
