/* @layer renderer-app @kind logic */
import { runFileAction } from '../files/run-file-action';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

const splitLegacyItem = async (path: string): Promise<void> => {
  await runFileAction({ kind: 'openPath', path });
  const documentId = useDocumentStore.getState().activeId;
  const workspaces = useWorkspaceStore.getState();
  if (documentId !== null && workspaces.workspaces[documentId]?.legacy) workspaces.showSplit(documentId);
};

export { splitLegacyItem };
