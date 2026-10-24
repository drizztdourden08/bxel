/* @layer renderer-app @kind logic */
import type { AssetKey, DocumentId } from '@bxel/document';
import type { FileKit } from '../files/files.type';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { adoptPath } from './adopt-path';
import { besidePath } from './beside-path';
import { pickAssetPath } from './pick-asset-path';

const givePaths = async (kit: FileKit, documentId: DocumentId, keys: readonly AssetKey[]): Promise<boolean> => {
  let granted = false;
  for (const key of keys) {
    const workspace = useWorkspaceStore.getState().workspaces[documentId];
    const view = kit.host.view(documentId);
    if (!workspace || !view) return false;
    if (workspace.paths.has(key.id) || key.kind === 'palette') continue;
    const beside = granted ? besidePath(workspace, view.state.artwork, key) : null;
    if (beside !== null) {
      adoptPath(kit.host, documentId, key, beside);
      continue;
    }
    const picked = await pickAssetPath(kit.documents, workspace, view.state.artwork, key);
    if (picked === null) return false;
    granted = picked.granted;
    adoptPath(kit.host, documentId, key, picked.path);
  }
  return true;
};

export { givePaths };
