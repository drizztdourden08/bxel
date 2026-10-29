/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

const assetPathOf = (assetId: string): string => {
  const { activeId } = useDocumentStore.getState();
  if (activeId === null) return '';
  return useWorkspaceStore.getState().workspaces[activeId]?.paths.get(assetId) ?? '';
};

export { assetPathOf };
