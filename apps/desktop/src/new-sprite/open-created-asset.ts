/* @layer renderer-app @kind logic */
import type { AssetKey, DocumentId } from '@bxel/document';
import { fileKit } from '../files/file-kit';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { focusTab } from '../workspace/focus-tab';
import { saveTab } from '../workspace/save-tab';
import { tabOf } from '../workspace/tab-of';

const openCreatedAsset = async (documentId: DocumentId, key: AssetKey): Promise<string | null> => {
  const tab = tabOf(documentId, key);
  focusTab(tab);
  const kit = fileKit();
  if (!kit || useWorkspaceStore.getState().workspaces[documentId]?.kind !== 'project') return null;
  const saved = await saveTab(kit, tab, false);
  return saved.kind === 'failed' ? saved.message : null;
};

export { openCreatedAsset };
