/* @layer renderer-app @kind logic */
import type { AssetKey, DocumentId } from '@bxel/document';
import { useSubjectStore } from '../properties-subject/useSubjectStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { focusTab } from '../workspace/focus-tab';
import { tabOf } from '../workspace/tab-of';

const showLinked = (documentId: DocumentId, key: AssetKey): void => {
  if (useSubjectStore.getState().pin === null) {
    focusTab(tabOf(documentId, key));
    return;
  }
  const path = useWorkspaceStore.getState().workspaces[documentId]?.paths.get(key.id) ?? null;
  useSubjectStore.getState().pinTo({ path, key });
};

export { showLinked };
