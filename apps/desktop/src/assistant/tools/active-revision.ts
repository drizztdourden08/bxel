/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../../stores/useDocumentStore';

const activeRevision = (): number | null => {
  const { activeId, host } = useDocumentStore.getState();
  return activeId === null ? null : (host.view(activeId)?.state.revision ?? null);
};

export { activeRevision };
