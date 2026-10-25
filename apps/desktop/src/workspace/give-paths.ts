/* @layer renderer-app @kind logic */
import type { AssetKey, DocumentId } from '@bxel/document';
import type { FileKit } from '../files/files.type';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { adoptPath } from './adopt-path';
import { pathInDir } from './path-in-dir';
import { pickAssetPath } from './pick-asset-path';

const givePaths = async (kit: FileKit, documentId: DocumentId, keys: readonly AssetKey[], folderGranted = false): Promise<boolean> => {
  let granted = folderGranted;
  for (const key of keys) {
    const workspace = useWorkspaceStore.getState().workspaces[documentId];
    const view = kit.host.view(documentId);
    if (!workspace || !view) return false;
    if (workspace.paths.has(key.id) || key.kind === 'palette') continue;
    const beside = granted ? pathInDir(workspace, view.state.artwork, key) : null;
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
