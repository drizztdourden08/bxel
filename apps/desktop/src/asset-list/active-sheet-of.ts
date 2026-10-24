/* @layer renderer-app @kind logic */
import type { DocumentId, Sheet } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { projectWorkspaceId } from '../workspace/project-workspace-id';

const activeSheetOf = (): { readonly documentId: DocumentId; readonly sheet: Sheet } | null => {
  const documentId = projectWorkspaceId();
  const { tabs, activeTab } = useWorkspaceStore.getState();
  const key = tabs.find((tab) => tab.id === activeTab && tab.documentId === documentId)?.key;
  if (documentId === null || key?.kind !== 'sheet') return null;
  const sheet = useDocumentStore.getState().host.view(documentId)?.state.artwork.sheets.find((each) => each.id === key.id);
  return sheet ? { documentId, sheet } : null;
};

export { activeSheetOf };
